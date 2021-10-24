import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useSocketContext } from '../Providers/Chat';
import client from "../../utilities/apollo/client.config";
import { QUERY_IN_RANGE } from "../../utilities/graphql/queries";

export default function UsersInRange({ inRange }) {
    const state = useSelector((state) => state);
    const socketConn = useSocketContext();
    const { me, usersInRange } = state
    const [users, setUsers] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        setMounted(true);
        setUsers(inRange)
        return () => { setMounted(false); setUsers(false) }
    }, [])


    useEffect(() => {
        if (mounted == true) {
            setSocket(socketConn)
        }
        // socket.on('updateUsersInRange', async () => {
        //     console.log(`received notice to update`)
        //     const { data } = await client.query({ query: QUERY_IN_RANGE });
        //     SetUsersInRage({ data, dispatch });
        // });
        // if (mounted === true && state) {

        //     console.log(`triggered`, state.usersInRange)
        //     if (usersInRange !== undefined && usersInRange !== null) {
        //         setUsers(usersInRange)
        //     } else {
        //         setUsers(false)
        //     }
        // }


    }, [mounted])

    useEffect(() => {
        if (socket) {
            socket.on('updateUsersInRange', async () => {
                console.log(`received notice to update`)
                const { data } = await client.query({ query: QUERY_IN_RANGE });
                setUsers(data.inRange.usersInRange)
            });
        }
    })
    return (
        users?.length > 0 ? (
            <section className='bg-gray-800 rounded p-2 flex-row justify-center text-white'>
                <h1 className='text-center mb-2'>Users In Range</h1>
                <div className='max-h-40 p-1 overflow-x-hidden overflow-y-auto'>
                    {users.map(user => (
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