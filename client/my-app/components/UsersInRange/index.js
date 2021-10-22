import { useState, useEffect } from 'react'
export default function Test({ inRange }) {
    const [users, setUsers] = useState({});
    useEffect(() => {
        setUsers(inRange);
    }, [])

    return (
        users?.length > 0 ? (
            <section className='bg-gray-800 rounded p-2 flex-row justify-center text-white'>
                <h1 className='text-center mb-2'>Users In Range</h1>
                <div className='max-h-40 p-1 overflow-x-hidden overflow-y-auto'>
                    {inRange.map(user => (
                        <li key={user.username} className="px-2" style={{ listStyle: 'none' }}>
                            {user.username}
                            <ul >
                                <li className="ml-2" style={{ listStyle: 'none' }}>
                                    {user.location ? `${user.location.city}, ${user.location.state}` : null}
                                </li>
                            </ul>
                        </li>
                    )
                    )}
                </div>
            </section>
        ) : 'No users!'
    );
};