import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { MdAccountBox } from 'react-icons/md';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { useSocketContext } from '../Providers/Chat';
import { useSelector, useDispatch } from 'react-redux';
import ButtonWithToolTip from '../Button/ButtonWithToolTip';
import { ADD_FRIEND } from '../../utilities/graphql/mutations';
import { _REDUX_SET_MODAL } from '../../utilities/redux/actions';
import Avatar from '../userAvatar/Avatar';


export default function UsersInRangeOptionsModal(props) {
    const { username, _id, socket, status, location } = props;
    const [thisSocket, setThisSocket] = useState(null);
    const [isMounted, setMounted] = useState(false);
    const [addFriend] = useMutation(ADD_FRIEND);
    const state = useSelector(state => state);
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
    const iconSize = '35px';
    const iconColor = 'text-gray-400';
    const pageIcons = friendStatus === false ? [
        {
            Icon: MdAccountBox,
            toolTip: "View Profile",
            iconSize: iconSize,
            action: 'viewProfile',
            settings: {
                button: {
                    color: 'gray-800',
                    hover: 'purple-500'
                },
                icon: {
                    color: iconColor
                },
                toolTip: {
                    classNames: 'mt-20 text-medium p-2 bg-purple-500 border-2 border-black drop-shadow-lg',
                },
            },
        },
        {
            Icon: AiOutlineUserAdd,
            toolTip: "AddFriend",
            iconSize: iconSize,
            iconColor: iconColor,
            action: handleAddFriend,
            settings: {
                button: {
                    color: 'gray-800',
                    hover: 'green-500'
                },
                icon: {
                    color: iconColor
                },
                toolTip: {
                    classNames: 'mt-20 text-medium p-2 bg-green-500 border-2 border-black drop-shadow-lg',
                },
            },
        },
    ] : [
        {
            Icon: MdAccountBox,
            toolTip: "View Profile",
            iconSize: iconSize,
            action: 'viewProfile',
            settings: {
                button: {
                    color: 'gray-800',
                    hover: 'purple-500'
                },
                icon: {
                    color: iconColor
                },
                toolTip: {
                    classNames: 'mt-20 text-medium p-2 bg-purple-500 border-2 border-black drop-shadow-lg',
                },
            },
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


    async function handleAddFriend(e) {
        e.preventDefault();
        try {
            const addNewFriend = await addFriend({
                variables: { friendId: _id }
            });
            if (addNewFriend !== undefined || addNewFriend !== null) {
                const emitData = {
                    data: {
                        type: 'Friend Request',
                        from: {
                            username: me.username,
                            userID: me._id,
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
                console.log(addNewFriend);
            };
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <section className='w-full flex flex-col justify-between gap-3 items-center text-gray-300 bg-gray-800 rounded-md p-2'>
            <header className='w-full flex flex-col justify-start items center gap-2'>
                <h1 className='text-center break-normal py-1 text-xl'> {username}</h1>
                <Avatar profilePicture={props?.profile?.profilePicture} size='40px' />
            </header>
            <div>
                {/* BIO AND LOCATION HERE */}
            </div>
            <div className=" w-full my-2 flex flex-row justify-around p-2">
                {pageIcons.map(option => (
                    <span key={option.toolTip + `${Date.now()}`}>
                        <ButtonWithToolTip
                            dispatch={dispatch}
                            {...option}
                        />
                    </span>
                ))}
            </div>
        </section>
    );
};

