import { _REDUX_SET_NOTIFICATION_LIST_VISIBILITY } from '../../utilities/redux/actions';
import { MdNotifications } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';


export function toggleNotificationList(state, dispatch) {
    return dispatch({
        type: _REDUX_SET_NOTIFICATION_LIST_VISIBILITY,
        toggle: state
    });
};

export default function AlertIcon() {
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    const { incomingFriendRequests, notificationList } = state;

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