import { useState, useEffect } from 'react';
import { MdNotifications } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import client from '../../utilities/apollo/client.config';
import { QUERY_FRIEND_REQUESTS } from '../../utilities/graphql/queries';
import { _REDUX_SET_NOTIFICATION_LIST_VISIBILITY } from '../../utilities/redux/actions';
import { reduxUpdateIncomingFriendRequests } from '../../utilities/redux/helpers';

export function toggleNotificationList(state, dispatch) {
    return dispatch({
        type: _REDUX_SET_NOTIFICATION_LIST_VISIBILITY,
        toggle: state
    });
};

export async function getFriendRequests(dispatch) {
    const { data, error } = await client.query({ query: QUERY_FRIEND_REQUESTS, fetchPolicy: 'network-only' });
    reduxUpdateIncomingFriendRequests({ data: data.friendRequests, dispatch });
    console.log({ data, error })
}
export default function AlertIcon() {
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    const [mounted, setMounted] = useState(null);
    const { incomingFriendRequests, notificationList } = state;
    const [notificationCount, setNotificationCount] = useState(0);

    async function getData() {
        return await getFriendRequests(dispatch);
    }
    useEffect(() => {
        setMounted(true);
        getData()
        return () => setMounted(null);
    }, [])

    return (

        <span className='static' onClick={() => { toggleNotificationList(!notificationList, dispatch) }}>
            {
                incomingFriendRequests.length > 0 ?
                    <span className='icon absolute p-1 animate-pulse'>
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