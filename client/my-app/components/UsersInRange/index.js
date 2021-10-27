import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useSocketContext } from '../Providers/Chat';
import client from "../../utilities/apollo/client.config";
import { QUERY_IN_RANGE } from "../../utilities/graphql/queries";
import UserItem from '../userItem/UserItem';

export default function UsersInRange({ inRange }) {
    const state = useSelector((state) => state);
    const socketConn = useSocketContext();
    const [users, setUsers] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        setMounted(true);
        setUsers(inRange);
        return () => { setMounted(false); setUsers(false) };
    }, []);
    useEffect(() => {
        if (mounted == true) {
            setSocket(socketConn);
        }
    }, [mounted]);
    useEffect(() => {
        if (socket) {
            socket.on('updateUsersInRange', async () => {
                console.log(`received notice to update`)
                const { data } = await client.query({ query: QUERY_IN_RANGE, fetchPolicy: 'network-only' });
                setUsers(data.inRange.usersInRange);
            });
        }
    }, [socket]);
    if (mounted == false) return null;

    return (
        users?.length > 0 ? (
            <section className='bg-gray-800 rounded p-2 flex-row justify-center text-white'>
                <h1 className='text-center mb-2'>Users In Range</h1>
                <div className='max-h-40 p-1 overflow-x-hidden overflow-y-auto'>
                    {users.map(user => (
                        <UserItem key={user._id} user={user} />
                    )
                    )}
                </div>
            </section>
        ) : 'No users!'
    );
};