import { useState, useEffect } from 'react'
export default function Test({ allUsers }) {
    const [users, setUsers] = useState({});
    useEffect(() => {
        setUsers(allUsers)
    }, [])

    return (
        users?.length > 0 ? allUsers.map(user => (
            <li key={user.username} style={{ listStyle: 'none' }}>
                {user.username}
                <ul >
                    <li style={{ listStyle: 'none' }}>
                        {user.location ? `${user.location.city}, ${user.location.state}` : null}
                    </li>
                </ul>
            </li>
        )
        ) : 'No users!'
    );
};