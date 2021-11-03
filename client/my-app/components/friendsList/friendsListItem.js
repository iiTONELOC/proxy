import { RiMoreFill } from "react-icons/ri";
import { useState, useEffect } from 'react';
import { hoverHandler } from "../navigation/NavLink";
import FriendOptions from '../userActions/FriendOptions';
import AvatarWithStatus from '../userAvatar/AvatarWithStatus';
import { calculateDistance } from '../../utilities/graphql/userAPI';
import { statusColor } from "../../utilities/utils";




export default function FriendsListItem({ user }) {
    const [isMounted, setMounted] = useState(null);
    const [hover, setHover] = useState(false);
    const [howFar, setHowFar] = useState(null);


    function onHover() {
        return hoverHandler({ hover, setHover });
    };
    useEffect(() => {
        setMounted(true);
        return () => setMounted(null);
    }, []);

    useEffect(() => {
        if (isMounted) {
            const args = {
                lat1: user.location.latitude,
                lon1: user.location.longitude,
            }
            const d = async () => await calculateDistance({ ...args });
            d().then(res => { console.log('HERE', res); setHowFar(res) });
        }
    }, [isMounted]);

    if (!isMounted) return null
    return (
        <article
            key={user.username}
            onMouseEnter={onHover}
            onMouseLeave={onHover}
            className=''
        >
            <div className=' p-1 flex flex-row justify-between items-center' style={{ height: '50px ' }}>

                <div className='flex flex-row justify-between items-center w-2/3 gap-2'>
                    <AvatarWithStatus user={user} size={'30px'} />
                    <p>{user.username}</p>
                    <p className={`text-${statusColor(user.status.status)}`}>{user.status.status}</p>
                    <p className='text-gray-400 italic'>{howFar} miles</p>
                </div>
                <span className='static flex flex-row justify-between items-center '>
                    {hover ? <FriendOptions user={user} /> : <RiMoreFill size='30px' color='gray' />}

                </span>

            </div>
        </article>
    )
}