import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import FriendsListItem from './FriendsListItem';


export default function FriendsList() {
    const state = useSelector((state) => state);
    const { friendsList } = state;
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => { setMounted(false) };
    }, []);

    if (mounted == false) return null;
    return (
        friendsList && friendsList.length > 0 ? (
            <section className='bg-gray-800 rounded p-2 flex-row justify-center text-white' >
                <h1 className='text-center mb-2'>Nodes</h1>
                <div className='max-h-40 p-1 overflow-x-hidden overflow-y-auto'>
                    {friendsList.map(user => (
                        <FriendsListItem key={user.username} user={user} />
                    )
                    )}
                </div>
            </section>
        ) : <p>Make some friends!</p>
    );
};