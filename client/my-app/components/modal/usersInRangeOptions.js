import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { MdAccountBox } from 'react-icons/md';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { useSocketContext } from '../Providers/Chat';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_FRIEND } from '../../utilities/graphql/mutations';
import { _REDUX_SET_MODAL } from '../../utilities/redux/actions';

export default function UsersInRangeOptionsModal(props) {
    const { username, _id, socket, status, location } = props;
    const [thisSocket, setThisSocket] = useState(null);
    const [isMounted, setMounted] = useState(false);
    const [addFriend] = useMutation(ADD_FRIEND);
    const [active, setActive] = useState(false);
    const state = useSelector(state => state);
    const [hover, setHover] = useState(false);
    const mySocket = useSocketContext();
    const dispatch = useDispatch();
    const { me, friendsList } = state;

    function isFriend() {
        if (friendsList) {
            const list = friendsList.filter(friend => friend.username === username)
            if (list.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false
        }

    }
    const friendStatus = isFriend();
    const pageIcons = friendStatus === false ? [
        {
            icon: MdAccountBox,
            props: {
                onMouseEnter: hoverHandler,
                onMouseLeave: hoverHandler
            },
            toolTip: "View Profile",
            state: hover
        },
        {
            icon: AiOutlineUserAdd,
            props: {
                onMouseEnter: activeHandler,
                onMouseLeave: activeHandler,
            },
            toolTip: "AddFriend",
            state: active,
            onClick: handleAddFriend
        },
    ] : [
        {
            icon: MdAccountBox,
            props: {
                onMouseEnter: hoverHandler,
                onMouseLeave: hoverHandler
            },
            toolTip: "View Profile",
            state: hover
        },

    ];
    useEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
        }
    }, [])
    useEffect(() => {
        if (isMounted) {
            if (mySocket.connected && !thisSocket) {
                setThisSocket(mySocket);
            }
        }
    }, [isMounted])
    function hoverHandler() {
        setHover(!hover);
    };
    function activeHandler() {
        setActive(!active);
    };
    function toggleModal(e) {
        e.preventDefault();
        dispatch({
            type: _REDUX_SET_MODAL,
            modalView: 'null'
        });
    }
    async function handleAddFriend(e) {
        e.preventDefault();
        console.log(`you clicked add friend!`);
        try {
            // const addNewFriend = await client.mutate({
            //     mutation: ADD_FRIEND, variables: { friendId: _id }
            // })
            const addNewFriend = await addFriend({
                variables: { friendId: _id }
            });
            if (addNewFriend !== undefined || addNewFriend !== null) {
                /*
                    need to pkg data for socket server,
                    expects current userInfo and the
                    userID of the friend to add
                 */


                const emitData = {
                    data: {
                        type: 'Friend Request',
                        from: {
                            username: me.username,
                            userID: me._id,
                            location: { city: me.location.city, state: me.location.state },
                            status: { online: me.status.online, status: me.status.status },
                            friends: me.friends.length,
                            bio: me.profile.bio,
                        }
                    },
                    sendTo: socket,
                };

                if (thisSocket) { thisSocket.emit("sendFriendRequest", emitData) };

                dispatch({
                    type: _REDUX_SET_MODAL,
                    modalView: { view: 'success', data: 1500 },
                    toggle: 'false'
                });
            } else {
                // log the issue incase request wasn't successful for whatever reason
                console.log(addNewFriend);
            };
        } catch (error) {
            console.log(error);
        };
    }


    return (
        <section className=' text-white p-2' style={{ height: '170x' }}>
            <div className="modal-header">
                <h3 className="text-center text-xl">{username}</h3>
            </div>
            <div className=" my-2 flex flex-row justify-around h-20">
                {pageIcons.map((icon, index) => (
                    <div className="flex flex-col items-center w-2/6" key={index}>
                        <icon.icon size={'35px'} onMouseEnter={icon.props.onMouseEnter} onMouseLeave={icon.props.onMouseLeave} onClick={icon.onClick} />
                        {icon.state === true ? <span className={`text-sm text-center bg-black rounded-lg p-1  `}>{icon.toolTip}</span> : null}
                    </div>
                ))}
            </div>
        </section>
    );
};

