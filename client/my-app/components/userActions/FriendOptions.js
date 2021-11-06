import { HiMail } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { GoDiffRemoved } from 'react-icons/go';
import { AiOutlineProfile } from 'react-icons/ai';
import ButtonWithToolTip from '../Button/ButtonWithToolTip';
import { _REDUX_SET_MODAL } from '../../utilities/redux/actions';
import client from '../../utilities/apollo/client.config';
import { REMOVE_FRIEND } from '../../utilities/graphql/mutations';
import { useSocketContext } from '../Providers/Chat';
import { getMyFriendsList } from '../../utilities/graphql/userAPI';
const iconSize = '25px';
const iconColor = 'text-gray-400';


export default function FriendOptions({ user }) {
    const dispatch = useDispatch();
    const [isMounted, setMounted] = useState(false);
    const [thisSocket, setThisSocket] = useState(null);
    const mySocket = useSocketContext();
    const state = useSelector(state => state);
    const { me } = state;
    const options = [
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
                }
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
                }
            },
        },
    ];
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, []);
    useEffect(() => {
        if (isMounted) {
            if (mySocket.connected && !thisSocket) {
                setThisSocket(mySocket);
            }
        }
    })
    if (!isMounted) return null
    async function handleRemove(e) {
        e.preventDefault();
        try {
            const removeFriend = await client.mutate({
                mutation: REMOVE_FRIEND,
                variables: { friendId: user._id }
            });
            if (removeFriend !== undefined || removeFriend !== null) {
                const emitData = {
                    sendTo: { userID: user._id },
                    data: { username: me.username },
                };
                if (thisSocket) { thisSocket.emit("removedUser", emitData) };
                getMyFriendsList(dispatch)
            } else {
                console.log(removeFriend);
            };
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <div className='p-1 flex justify-between items-center w-full ' style={{ width: '95px' }}>
            {
                options.map(option => (
                    <ButtonWithToolTip
                        key={option.toolTip + `${Date.now()}`}
                        dispatch={dispatch}
                        user={user}
                        {...option}
                    />
                ))
            }
        </div>
    );
};
