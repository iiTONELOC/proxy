export default function UserItem({ user }) {
    return (
        <article key={user.username} className="px-2" style={{ listStyle: 'none' }}>
            {user.username}
            <ul >
                <li className="ml-2" style={{ listStyle: 'none' }}>
                    {user.location ? `${user.location.city}, ${user.location.state}` : null}
                </li>
            </ul>
        </article>
    )
}