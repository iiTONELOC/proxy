import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from './Avatar';
import { genTailwindColorEquiv } from '../../clientUtilities/utils'



export default function AvatarWithStatus({ user, size }) {
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    const [mounted, setMounted] = useState(null);
    const [statusColor, setStatusColor] = useState('');

    useEffect(() => {
        setMounted(true);
        return () => setMounted(null);
    }, [])
    useEffect(() => {
        if (user.status.online === true) {
            setStatusColor('success')
        } else {
            setStatusColor('danger')
        }
    }, [user])
    if (!mounted) return null;
    return (
        <span className='relative'>
            <span className='absolute'>
                <svg height="25" width="25" >
                    <circle cx="5" cy="5" r="4" stroke={`${genTailwindColorEquiv(statusColor)}`} strokeWidth="2" fill={`${genTailwindColorEquiv(statusColor)}`} />
                </svg>
            </span>
            <Avatar size={size} color='bg-gray-500' profilePicture={user.profile.profilePicture} />
        </span>
    );
};