import { useState, useEffect } from 'react';
import Avatar from '../userAvatar/Avatar'
import { useSelector, useDispatch } from 'react-redux';
import { MdPersonAdd } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import Button from '../Button';
import client from '../../utilities/apollo/client.config';
import { ACCEPT_FRIEND } from '../../utilities/graphql/mutations';
import { updateUserData } from '../../utilities/redux/helpers';
export default function NotificationItem({ user }) {

    const [active, setActive] = useState(false);
    const [isMounted, setMounted] = useState(false);
    const [hover, setHover] = useState(false);
    const [thisSocket, setThisSocket] = useState(null);
    const state = useSelector(state => state);
    const { socket } = state;
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
        console.log(`here`, user)
        return () => {
            setMounted(false);
        }
    }, [])
    useEffect(() => {
        if (isMounted) {
            if (socket.connected && !thisSocket) {
                setThisSocket(socket);
            }
        }
    }, [isMounted])
    if (!isMounted) return null;
    function activeHandler() {
        setActive(!active);
    };
    function onHover() {
        setHover(!hover);
    }

    async function acceptFriendRequest() {
        if (user) {
            const { _id } = user;
            try {
                const mutationResult = await client.mutate({
                    mutation: ACCEPT_FRIEND,
                    variables: { friendId: _id }
                });
                if (mutationResult) {
                    // const userData = mutationResult.data.acceptFriendRequest

                    console.log(`Result`, mutationResult)

                    // updateUserData(userData, dispatch);
                    // const sendTo = user.socket
                    // const emitData = { sendTo, userData }
                    // thisSocket.emit('acceptedFriendRequest', emitData);
                }

            } catch (error) {
                console.error(error)
            }
        }


    };

    return (
        <article
            key={user.username}

            className='p-2'
        >
            <div className='p-1 flex justify-between items-center'>
                <Avatar size='30px' />
                {user.username}
                <p className=''>{user.location ? `${user.location.city}, ${user.location.state}` : null}</p>
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
    )
}