import Link from 'next/link';
import { useState } from 'react';



export default function NavLink({ name, location, onClick, icon }) {
    const [hover, setHover] = useState(false);
    function onHover() {
        return hoverHandler({ hover, setHover });
    }
    return (
        <Link href={location ? `${location}` : '#'}>
            <li
                className={`p-3 mx-1 text-center items-center rounded  ${icon ? 'flex items-center' : null} ${hover ? 'bg-gray-500' : ''}`}
                onMouseEnter={onHover}
                onMouseLeave={onHover}
                onClick={onClick ? onClick : null}
                style={{ cursor: 'pointer' }}
            >
                {icon ? icon : <p className='text-2xl'>{name}</p>}
            </li>
        </Link>
    )
}

export const hoverHandler = ({ hover, setHover }) => {
    setHover(!hover)
}