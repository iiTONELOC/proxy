import { CgOptions } from 'react-icons/cg'
import { useState, useEffect } from 'react'
import { hoverHandler } from "../navigation/NavLink";
import AddFriend from '../userActions/AddFriend';
export default function UserItem({ user }) {
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
            <div className='p-1 flex justify-between items-center'>
                {user.username}
                <p className='flex-shrink'>{user.location ? `${user.location.city}, ${user.location.state}` : null}</p>
                {hover ? <span>
                    <AddFriend />
                </span> : null}

            </div>

        </article>
    )
}