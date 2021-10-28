import { MdNotifications } from 'react-icons/md';
import { useSelector } from 'react-redux';
export default function AlertIcon() {
    const state = useSelector(state => state);
    const { incomingFriendRequests } = state;

    return (

        <span className='static'>
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