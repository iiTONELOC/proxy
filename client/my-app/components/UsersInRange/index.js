import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import UserItem from '../userItem/UserItem';

export default function UsersInRange() {
    const state = useSelector((state) => state);
    const { usersInRange } = state;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => { setMounted(false) };
    }, []);

    if (mounted == false) return null;

    return (
        usersInRange?.length > 0 ? (
            <section className='bg-gray-800 rounded p-2 flex-row justify-center text-white'>
                <h1 className='text-center mb-2'>Proxies</h1>
                <div className='max-h-40 p-1 overflow-x-hidden overflow-y-auto'>
                    {usersInRange.map(user => (
                        <UserItem key={user._id} user={user} />
                    )
                    )}
                </div>
            </section>
        ) : 'No users!'
    );
};