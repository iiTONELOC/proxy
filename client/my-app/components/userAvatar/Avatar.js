import { useEffect, useState } from "react";
import { FaUserSecret } from 'react-icons/fa'

const colors = [
    'bg-gray-900',
    'bg-red-500',
    'bg-yellow-600',
    'bg-green-500',
    'bg-blue-400',
    'bg-indigo-500',
]
const length = colors.length - 1

export default function Avatar(props) {
    // props = size, color
    // size = height, pixels 
    // color = backgroundColor
    const [mounted, setMounted] = useState(null);
    const { size, color, profilePicture } = props
    const [randomColor, setRandom] = useState(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(null);
    }, []);
    useEffect(() => {
        if (mounted) {
            const num = Math.floor(Math.random() * length)
            setRandom(colors[num])
        }
    }, [mounted]);
    if (!mounted) return null;

    return (
        <div className="flex justify-center items-center">
            {profilePicture ? <span style={{ height: `${size}` }}>
                <img src={profilePicture} style={{ objectFit: 'contain' }} />
            </span> : <span className={color ? `${color}` : `${randomColor}`}>
                <FaUserSecret size={size} />
            </span>}
        </div>
    )
}


