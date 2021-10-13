import { ALL_USERS } from '../../utilities/graphql/queries';
import { useQuery } from '@apollo/client'
export default function Test() {
    const { data, loading, error } = useQuery(ALL_USERS);
    if (loading) {
        return <h2>Loading...</h2>;
    }
    if (error) {
        console.error(error);
        return null;
    }
    const { users } = data;
    return (
        users.map(user => (
            <li key={user.username} style={{ listStyle: 'none' }}>
                {user.username}
                <ul >
                    <li style={{ listStyle: 'none' }}>
                        {user.location ? `${user.location.city}, ${user.location.state}` : null}
                    </li>
                </ul>
            </li>
        )
        )
    );
};