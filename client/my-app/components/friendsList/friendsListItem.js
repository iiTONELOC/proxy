import { useState, useEffect } from 'react';
import { hoverHandler } from "../navigation/NavLink";
import FriendOptions from '../userActions/FriendOptions';
import UserOptions from '../userActions/UserOptions';
import AvatarWithStatus from '../userAvatar/AvatarWithStatus';

export default function FriendsListItem({ user }) {
    const [isMounted, setMounted] = useState(false);
    const [hover, setHover] = useState(false);
    function onHover() {
        return hoverHandler({ hover, setHover });
    }
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, [])
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
                    <AvatarWithStatus user={user} />
                    <span>{user.username}</span>
                </div>
                <span className='static flex flex-row justify-between items-center'>
                    {hover ? <FriendOptions {...user} /> : null}

                </span>

            </div>
        </article>
    )
}