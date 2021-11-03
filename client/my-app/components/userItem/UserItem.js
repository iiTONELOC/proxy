import { useState, useEffect } from 'react';
import Avatar from '../userAvatar/Avatar'
import { hoverHandler } from "../navigation/NavLink";
import UserOptions from '../userActions/UserOptions';
import { RiMoreFill } from "react-icons/ri";
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
            <div className='p-1 flex justify-between items-center' style={{ height: '50px ' }}>
                <div className='flex flex-row justify-between items-center w-4/6 '>
                    <Avatar size='20px' />
                    <p>{user.username}</p>
                    <p className=''>{user.location ? `${user.location.city}, ${user.location.state}` : null}</p>
                </div>

                {hover ?

                    <UserOptions {...user} />
                    :
                    <RiMoreFill size='30px' color='gray' />}
            </div>
        </article>
    )
}