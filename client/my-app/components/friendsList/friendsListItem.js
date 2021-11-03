import { useState, useEffect } from 'react';
import { hoverHandler } from "../navigation/NavLink";
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
                <AvatarWithStatus user={user} />
                <span>
                    {user.username}
                </span>
                <span>
                    <UserOptions {...user} />
                </span>

            </div>
        </article>
    )
}