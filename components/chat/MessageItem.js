import Avatar from "../userAvatar/Avatar";
import { useEffect, useState } from "react";
import { hoverHandler } from "../navigation/NavLink";
import { formatTime_hh_mm_ss } from "../../lib/utils";

export default function MessageItem({ message, user }) {
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
            className={`w-full h-auto mb-2   p-2 flex flex-row items-center ${!user ? 'justify-items-start' : 'justify-items-end'} ${hover ? 'bg-gray bg-gray-600' : ''}`}>

            {!user ? <> <Avatar size={'35px'} />
                <div className='ml-3 flex flex-col w-full'>
                    <p className='text-sm text-gray-400'> {formatTime_hh_mm_ss(message.time)}</p>
                    <p className='text-md ml-1'> {message.text}</p>
                </div> </> : <>
                <div className='mr-3 flex flex-col w-full text-right'>
                    <p className='text-sm text-gray-400'> {formatTime_hh_mm_ss(message.time)}</p>
                    <p className='text-md ml-1'> {message.text}</p>
                </div>
                <Avatar size={'35px'} />  </>
            }

        </article>
    )
}