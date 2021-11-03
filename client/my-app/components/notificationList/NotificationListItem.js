import Button from '../Button';
import Avatar from '../userAvatar/Avatar'
import { useState, useEffect } from 'react';
import { MdPersonAdd } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useSocketContext } from '../Providers/Chat'
import { useSelector, useDispatch } from 'react-redux';
import client from '../../utilities/apollo/client.config';
import { ACCEPT_FRIEND } from '../../utilities/graphql/mutations';
import { reduxSetUsersInRange, reduxUpdateIncomingFriendRequests, reduxSetMyFriends } from '../../utilities/redux/helpers';
import { getMyFriendsList } from '../../utilities/graphql/userAPI';

export default function NotificationItem({ user }) {
    const _id = user.from?.userID || user._id;
    const userInfo = user.from || user
    const [active, setActive] = useState(false);
    const [isMounted, setMounted] = useState(null);
    const [hover, setHover] = useState(false);
    const [thisSocket, setThisSocket] = useState(null);
    const state = useSelector(state => state);
    const socket = useSocketContext();
    const dispatch = useDispatch();

    const itemIcons = [
        {
            icon: MdPersonAdd,
            props: {
                onMouseEnter: onHover,
                onMouseLeave: onHover,
            },
            toolTip: "Accept Request",
            state: hover,
            onClick: acceptFriendRequest
        },
        {
            icon: FaRegTrashAlt,
            props: {
                onMouseEnter: activeHandler,
                onMouseLeave: activeHandler,
            },
            toolTip: "Deny Request",
            state: active,
            // onClick: 'handleAddFriend'
        },
    ];


    useEffect(() => {
        setMounted(true);
        return () => setMounted(null);
    }, []);

    useEffect(() => {
        if (isMounted) {
            if (socket.connected && !thisSocket) {
                setThisSocket(socket);
            }
        }
    }, [isMounted]);

    if (!isMounted) return null;
    function activeHandler() {
        setActive(!active);
    };

    function onHover() {
        setHover(!hover);
    };

    async function acceptFriendRequest() {
        if (user) {
            try {
                const mutationResult = await client.mutate({
                    mutation: ACCEPT_FRIEND,
                    variables: { friendId: _id }
                });
                if (mutationResult) {
                    const mD = mutationResult.data.acceptFriend;
                    thisSocket.emit('acceptedFriendRequest', { sendTo: userInfo, data: mD });
                    getMyFriendsList(dispatch)
                    reduxSetUsersInRange({ data: mD.usersInRange, dispatch });
                    reduxUpdateIncomingFriendRequests({ data: mD.incomingFriendRequests, dispatch });
                };
            } catch (error) {
                console.error(error);
            };
        };
    };

    return (
        <article
            key={userInfo.username}
            className='p-2'
        >
            <div className='p-1 flex justify-between items-center'>
                <Avatar size='30px' />
                {userInfo.username}
                <p className=''>{userInfo.location ? `${userInfo.location.city}, ${userInfo.location.state}` : null}</p>
                <span className='flex flex-row justify-between items-center w-2/6'>
                    {itemIcons.map((icon, index) => (
                        <div className="static flex flex-col items-center w-full" key={index} onMouseEnter={icon.props.onMouseEnter} onMouseLeave={icon.props.onMouseLeave} onClick={icon.onClick}>
                            <Button
                                color={{ color: `gray-600`, hover: `${icon.toolTip === 'Accept Request' ? 'green-500' : 'red-600'}` }}
                                radius={'rounded-md'}
                                class='text-white text-center p-2'
                            >
                                <icon.icon size={'25px'} />
                            </Button>
                            {icon.state === true ? <span className={`mt-12 ${icon.toolTip === 'Deny Request' ? 'mr-10' : ''} absolute text-sm text-center text-white  bg-black rounded-lg p-1`}>{icon.toolTip}</span> : null}
                        </div>
                    ))}
                </span>
            </div>
        </article>
    );
};