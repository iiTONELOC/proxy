import { useEffect, useState } from "react";
import { hoverHandler } from "../navigation/NavLink";
import { FaUserSecret } from 'react-icons/fa'
export default function MessageItem({ message }) {
    const [mounted, setMounted] = useState(false);
    const [hover, setHover] = useState(false);
    function onHover() {
        return hoverHandler({ hover, setHover });
    }
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    if (!mounted) return null;
    return (
        <article
            onMouseEnter={onHover}
            onMouseLeave={onHover}
            className={`w-full h-auto mb-2   p-2 flex flex-row items-center justify-items-start ${hover ? 'bg-gray bg-gray-500' : ''}`}>
            <span className='bg-gray-800' >
                <FaUserSecret size='35px' />
            </span>
            <div className='ml-3 flex flex-col'>
                <p className='text-sm text-gray-400'> {new Date(parseFloat(message.time)).toLocaleTimeString()}</p>
                <p className='text-md ml-1'> {message.text}</p>
            </div>
        </article>
    )
}