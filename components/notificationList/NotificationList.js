import { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import NotificationItem from './NotificationListItem';
import { useSelector, useDispatch } from 'react-redux';
import { calculateHeight } from '../../clientUtilities/utils';
import { toggleNotificationList } from '../alertIcon/AlertIcon';

export function NotificationList(props) {
    const [mounted, setMounted] = useState(false);
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const { incomingFriendRequests, notificationList } = state;

    useEffect(() => {
        setMounted(true);
        return () => { setMounted(false); }
    }, []);


    if (mounted === false) return null

    return (
        (incomingFriendRequests.length > 0 && notificationList === true ? (
            <section className={`absolute  w-full flex flex-row justify-end`} style={{ height: calculateHeight() }}>
                <div className='w-1/3 bg-gray-900 flex flex-col gap-3'>
                    <header className=' w-full text-center flex flex-row justify-between items center p-1' >
                        <h1 className='ml-5 text-gray-400 text-lg font-bold italic '>Friend Requests</h1>
                        <span className='p-1 bg-gray-900 hover:bg-red-600' onClick={() => { toggleNotificationList(false, dispatch) }}>
                            <AiOutlineClose color='white' size='20px' />
                        </span>
                    </header>
                    <div className=' flex flex-col w-full p-1'>
                        {incomingFriendRequests.length > 0 && incomingFriendRequests.map((data, index) => {
                            return (
                                <NotificationItem key={index} user={data} />
                            )
                        })}
                    </div>
                </div>
            </section>) : null)
    );
};