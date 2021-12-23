import Avatar from './Avatar';
import { useState, useEffect } from 'react';
import { genTailwindColorEquiv } from '../../lib/utils';
import { GoPrimitiveDot } from 'react-icons/go';

export default function AvatarWithStatus({ user, size, statusSize, statusStyle, picture }) {
    const [mounted, setMounted] = useState(null);
    const [statusColor, setStatusColor] = useState('');

    useEffect(() => {
        setMounted(true);
        return () => setMounted(null);
    }, []);
    useEffect(() => {
        if (user?.status?.online === true) {
            setStatusColor('success');
        } else {
            setStatusColor('danger');
        }
    }, [user])
    if (!mounted) return null;
    return (
        <div className='relative flex flex-col justify-start'>
            <span className='absolute' style={statusStyle}>
                <GoPrimitiveDot size={statusSize} color={`${genTailwindColorEquiv(statusColor)}`} />
            </span>
            <Avatar size={size} color='bg-gray-500' profilePicture={picture ? picture : user?.profile?.profilePicture} />
        </div>
    );
};