import Link from 'next/link';
import { useState } from 'react';



export default function NavLink({ name, location, onClick }) {
    const [hover, setHover] = useState(false);
    function onHover() {
        return hoverHandler({ hover, setHover });
    }
    return (
        <Link href={location ? `${location}` : '#'}>
            <li
                className={`p-3 mx-1 text-center rounded  bg-${hover ? 'gray-400' : ''}`}
                onMouseEnter={onHover}
                onMouseLeave={onHover}
                onClick={onClick ? onClick : null}
                style={{ cursor: 'pointer' }}
            >
                {name}
            </li>
        </Link>
    )
}

export const hoverHandler = ({ hover, setHover }) => {
    setHover(!hover)
}