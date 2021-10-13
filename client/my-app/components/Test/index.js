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
    const users = data.users;

    return (
        users.map(user => (
            <li key={user.username}>
                {user.username}
                <ul >
                    <li>
                        {`${user.location.city}, ${user.location.state}`}
                    </li>
                    <li>
                        {user.profile.bio}
                    </li>
                </ul>
            </li>
        )
        )
    );
};