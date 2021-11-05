import { useState, useEffect } from 'react';
import { MdNotifications } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { getFriendRequests } from '../../utilities/graphql/userAPI';
import { _REDUX_SET_NOTIFICATION_LIST_VISIBILITY } from '../../utilities/redux/actions';


export function toggleNotificationList(state, dispatch) {
    return dispatch({
        type: _REDUX_SET_NOTIFICATION_LIST_VISIBILITY,
        toggle: state
    });
};
export async function getData(dispatch) {
    return await getFriendRequests(dispatch);
}

export default function AlertIcon() {
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    const [mounted, setMounted] = useState(null);
    const { incomingFriendRequests, notificationList } = state;
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        setMounted(true);
        getData(dispatch);

        return () => setMounted(null);
    }, [])
    if (!mounted) return null;
    // useEffect(() => {

    // }, [incomingFriendRequests])

    return (
        <span className='static' onClick={() => { incomingFriendRequests.length > 0 ? toggleNotificationList(!notificationList, dispatch) : null }}>
            {
                incomingFriendRequests.length > 0 ?
                    <span className=' absolute p-1 animate-pulse'>
                        <svg height="20" width="20">
                            <circle cx="5" cy="5" r="4" stroke="red" strokeWidth="2" fill="red" />
                        </svg>
                    </span>
                    : null
            }
            <MdNotifications size='35px' />
        </span>
    )
}