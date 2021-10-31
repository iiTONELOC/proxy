import { useState, useEffect } from 'react';
import Avatar from '../userAvatar/Avatar'
import { hoverHandler } from "../navigation/NavLink";
import UserOptions from '../userActions/UserOptions';
export default function UserItem({ user }) {
    console.log(`user ITEM`, user)
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
            <div className='p-1 flex justify-between items-center' style={{ height: '50px ' }}>
                <Avatar size='20px' />
                {user.username}
                <p className=''>{user.location ? `${user.location.city}, ${user.location.state}` : null}</p>
                {hover ?
                    <span>
                        <UserOptions {...user} />
                    </span> :
                    null}

            </div>

        </article>
    )
}