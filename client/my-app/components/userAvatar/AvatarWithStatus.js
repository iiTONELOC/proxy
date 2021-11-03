import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from './Avatar';




export default function AvatarWithStatus({ user, size }) {
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    const [mounted, setMounted] = useState(null);
    const [statusColor, setStatusColor] = useState('');
    const { } = state;


    useEffect(() => {
        setMounted(true);
        // console.log(user)
        return () => setMounted(null);
    }, [])
    if (!mounted) return null;
    return (
        <span className='relative'>
            <span className='absolute'>
                <svg height="20" width="20" >
                    <circle cx="5" cy="5" r="4" stroke="red" strokeWidth="2" fill="red" />
                </svg>

            </span>
            <Avatar size={size} />
        </span>
    )
}