import { HiMail } from 'react-icons/hi';
import Avatar from '../userAvatar/Avatar';
import { useEffect, useState } from 'react';
import { GoDiffRemoved } from 'react-icons/go';
import { AiOutlineProfile } from 'react-icons/ai';
import { useSocketContext } from '../Providers/Socket';
import { useSelector, useDispatch } from 'react-redux';
import client from '../../lib/apollo/client.config';
import ButtonWithToolTip from '../Button/ButtonWithToolTip';
import { _REDUX_SET_MODAL } from '../../lib/redux/actions';
import { REMOVE_FRIEND } from '../../lib/graphql/mutations';
import { getMyFriendsList } from '../../lib/graphql/userAPI';
import { toggleNotificationList } from '../alertIcon/AlertIcon'
import AvatarWithStatus from '../userAvatar/AvatarWithStatus';


export default function FriendsListOptionsModal(props) {
    const { username, _id, socket, status, location, distance, profile } = props;
    const [thisSocket, setThisSocket] = useState(null);
    const [isMounted, setMounted] = useState(false);
    const state = useSelector(state => state);
    const mySocket = useSocketContext();
    const dispatch = useDispatch();
    const { me } = state;

    const iconSize = '35px';
    const iconColor = 'text-gray-400';
    const pageIcons = [
        {
            toolTip: 'View Profile',
            Icon: AiOutlineProfile,
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
            toolTip: 'Send Message',
            Icon: HiMail,
            iconSize: iconSize,
            action: 'sendMessage',
            settings: {
                button: {
                    color: 'gray-800',
                    hover: 'gray-500'
                },
                icon: {
                    color: iconColor
                },
                toolTip: {
                    classNames: 'mt-20 text-medium p-2 bg-gray-500 border-2 border-black drop-shadow-lg',
                },

            },
        },
        {
            toolTip: 'Remove Friend',
            Icon: GoDiffRemoved,
            iconSize: iconSize,
            action: handleRemove,
            settings: {
                button: {
                    color: 'gray-800',
                    hover: 'red-500'
                },
                icon: {
                    color: iconColor
                },
                toolTip: {
                    classNames: 'mt-20 text-medium p-2 bg-red-500 border-2 border-black drop-shadow-lg',
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


    async function handleRemove(e) {
        console.log('removing friend');
        e.preventDefault();
        try {
            const removeFriend = await client.mutate({
                mutation: REMOVE_FRIEND,
                variables: { friendId: _id }
            });
            if (removeFriend !== undefined || removeFriend !== null) {
                const emitData = {
                    sendTo: { userID: _id },
                    data: { username: me.username },
                };
                if (thisSocket) { thisSocket.emit("removedUser", emitData) };
                getMyFriendsList(dispatch);
                toggleNotificationList(false, dispatch);
                dispatch({
                    type: _REDUX_SET_MODAL,
                    modalView: 'null'
                });
            } else {
                console.log(removeFriend);
            };
        } catch (error) {
            console.log(error);
        };
    };


    return (
        <section className='w-full flex flex-col justify-between gap-3 items-center text-gray-300 bg-gray-800 rounded-md p-2'>
            <header className='w-full flex flex-col justify-start items center gap-2'>
                <h1 className='text-center break-normal py-1 text-xl'> {username}</h1>
                <span className='flex justify-center'>
                    <AvatarWithStatus
                        user={props}
                        size='65px'
                        statusSize='18px'
                        statusStyle={{
                            marginLeft: -4,
                            marginTop: -4,
                        }}
                    />
                </span>

            </header>
            <div>

                {/* BIO AND LOCATION HERE */}
            </div>
            <div className=" w-full my-2 flex flex-row justify-around p-2">
                {pageIcons.map(option => (
                    <span key={option.toolTip + `${Date.now()}`}>
                        <ButtonWithToolTip
                            dispatch={dispatch}
                            user={props}
                            {...option}
                        />
                    </span>
                ))}
            </div>
        </section>
    );
};

