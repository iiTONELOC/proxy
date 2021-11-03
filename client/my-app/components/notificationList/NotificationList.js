import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { genTailwindColorEquiv } from '../../utilities/utils';
import { AiOutlineClose } from 'react-icons/ai';
import { toggleNotificationList } from '../alertIcon/AlertIcon';
import NotificationItem from './NotificationListItem';
export function NotificationList(props) {
    const [notifications, setNotifications] = useState(null);
    const [mounted, setMounted] = useState(false);
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const { incomingFriendRequests, notificationList } = state;

    useEffect(() => {
        setMounted(true);
        return () => { setMounted(false); setNotifications(null); }
    }, [])
    useEffect(() => {
        if (mounted === true && incomingFriendRequests) {

            setNotifications(incomingFriendRequests);
        }
    }, [mounted]);
    useEffect(() => {
        if (mounted === true) {
            setNotifications(incomingFriendRequests);
        }
    }, [incomingFriendRequests]);

    if (mounted === false) return null

    return (
        (notifications && notificationList === true ? (
            <section className='absolute  w-full flex flex-row justify-end h-5/6 '>
                <div className='w-1/3 bg-black bg-opacity-70 flex flex-col gap-3'>
                    <header className='bg-gray-400 w-full text-center flex flex-row justify-between items center' >
                        <h1 className='ml-5'>Notifications</h1>
                        <span className='p-1 bg-gray-900' onClick={() => { toggleNotificationList(false, dispatch) }}>
                            <AiOutlineClose color={genTailwindColorEquiv('info')} size='20px' />
                        </span>
                    </header>

                    <div className='bg-gray-500 flex flex-col w-full '>
                        {notifications.map((data, index) => {
                            return (
                                <NotificationItem key={index} user={data} />
                            )
                        })}
                    </div>
                </div>
            </section>) : null)

    )
}