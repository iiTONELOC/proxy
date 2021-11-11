import Avatar from '../userAvatar/Avatar'
import { useState, useEffect } from 'react';
import { MdPersonAdd } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useSocketContext } from '../Providers/Socket'
import { useDispatch, useSelector } from 'react-redux';
import client from '../../clientUtilities/apollo/client.config';
import ButtonWithToolTip from '../Button/ButtonWithToolTip';
import { toggleNotificationList } from '../alertIcon/AlertIcon';
import { getMyFriendsList } from '../../clientUtilities/graphql/userAPI';
import { ACCEPT_FRIEND, REJECT_FRIEND } from '../../clientUtilities/graphql/mutations';
import { reduxSetUsersInRange, reduxUpdateIncomingFriendRequests } from '../../clientUtilities/redux/helpers';


export default function NotificationItem({ user }) {
    const [isMounted, setMounted] = useState(null);
    const [thisSocket, setThisSocket] = useState(null);
    const state = useSelector(state => state);
    const { me, incomingFriendRequests } = state
    const socket = useSocketContext();
    const dispatch = useDispatch();
    let _id, userInfo = {};
    const itemIcons = [
        {
            toolTip: 'accept request',
            Icon: MdPersonAdd,
            iconSize: '35px',
            action: () => { acceptFriendRequest(user) },
            settings: {
                button: {
                    color: 'gray-800',
                    hover: 'green-700'
                },
                icon: {
                    color: 'text-green-400'
                },
                toolTip: {
                    classNames: 'mt-20 text-medium p-2 bg-purple-500 border-2 border-black drop-shadow-lg',
                },
            }
        },
        {
            toolTip: 'deny request',
            Icon: FaRegTrashAlt,
            iconSize: '35px',
            action: () => { rejectFriendRequest(user) },
            settings: {
                button: {
                    color: 'gray-800',
                    hover: 'red-700'
                },
                icon: {
                    color: 'text-red-500'
                },
                toolTip: {
                    classNames: 'mt-20 text-medium p-2 bg-purple-500 border-2 border-black drop-shadow-lg',
                },
            }
        },
    ];
    if (user) {
        if (user.length) {
            if (user[0]?.type !== undefined) {
                _id = user[0].from.userID;
                userInfo = user[0].from
            } else {
                _id = user[0]?._id
                userInfo = user[0]
            };
        }
    }


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

    if (!isMounted || !userInfo) return null;
    async function acceptFriendRequest(user) {
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
                    reduxUpdateIncomingFriendRequests({ data: mD?.incomingFriendRequests?.length > 0 ? [mD.incomingFriendRequests] : [], dispatch });
                    mD?.incomingFriendRequests?.length > 0 ? null : toggleNotificationList(false, dispatch)
                };
            } catch (error) {
                console.error(error);
            };
        };
    };
    async function rejectFriendRequest(user) {
        if (user) {
            try {
                const mutationResult = await client.mutate({
                    mutation: REJECT_FRIEND,
                    variables: { friendId: _id }
                });
                if (mutationResult) {
                    const mD = mutationResult.data.rejectFriend;
                    thisSocket.emit('rejectRequest', { sendTo: mD, data: me.username })
                    reduxUpdateIncomingFriendRequests({ data: [], dispatch });
                };
            } catch (error) {
                console.error(error);
            };
        };
    };
    console.log(userInfo);

    return (
        incomingFriendRequests?.length > 0 ?
            <article
                key={userInfo?.username}
                className='p-2 bg-gray-700 rounded-md'
            >
                <div className='p-1 flex justify-between items-center'>
                    <span>
                        <ButtonWithToolTip
                            toolTip='view profile'
                            Icon={Avatar}
                            iconProps={{ profilePicture: userInfo?.profile?.profilePicture }}
                            iconSize='35px'
                            action='view profile'
                            settings={{
                                button: {
                                    color: 'gray-800',
                                    hover: 'gray-700'
                                },
                                icon: {
                                    color: ''
                                },
                                toolTip: {
                                    classNames: 'mt-20 text-medium p-2 bg-purple-500 border-2 border-black drop-shadow-lg',
                                },
                            }}
                        />
                    </span>
                    <p className='text-gray-300'>{userInfo?.username}</p>
                    <p className=''>{userInfo?.location ? `${userInfo?.location.city}, ${userInfo?.location.state}` : null}</p>
                    <span className='flex flex-row justify-between items-center w-2/6'>
                        {itemIcons.map((icon, index) => (
                            <ButtonWithToolTip {...icon} key={index} />
                        ))}
                    </span>
                </div>
            </article> : null
    );
};