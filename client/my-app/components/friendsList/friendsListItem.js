import { useState, useEffect } from 'react';
import { hoverHandler } from "../navigation/NavLink";
import FriendOptions from '../userActions/FriendOptions';
import { RiMoreFill } from "react-icons/ri";
import AvatarWithStatus from '../userAvatar/AvatarWithStatus';

export default function FriendsListItem({ user }) {
    const [isMounted, setMounted] = useState(false);
    const [hover, setHover] = useState(false);
    function onHover() {
        return hoverHandler({ hover, setHover });
    };
    useEffect(() => {
        setMounted(true);
        // console.log(user)
        return () => setMounted(false);
    }, []);
    if (!isMounted) return null
    return (
        <article
            key={user.username}
            onMouseEnter={onHover}
            onMouseLeave={onHover}
            className=''
        >
            <div className=' p-1 flex flex-row justify-between items-center' style={{ height: '50px ' }}>

                <div className='flex flex-row justify-between items-center w-1/2 '>
                    <AvatarWithStatus user={user} size={'30px'} />
                    <p>{user.username}</p>
                    <p className='text-gray-400 italic'>{user.status.status}</p>
                </div>
                <span className='static flex flex-row justify-between items-center'>
                    {hover ? <FriendOptions user={user} /> : <RiMoreFill size='30px' color='gray' />}

                </span>

            </div>
        </article>
    )
}