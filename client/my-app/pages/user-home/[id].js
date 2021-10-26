import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setChat } from '../../utilities/redux/helpers';
import Authorization from '../../components/Providers/Auth';
import serverClient from '../../utilities/apollo/server.config';
import { useSocketContext } from '../../components/Providers/Chat';
import ResponsiveLayout from '../../components/responsive-layout/Responsive';

export default function User_Home({ userID }) {
    const dispatch = useDispatch();
    // the useSelector is necessary to access our state
    const state = useSelector((state) => state);
    const { me } = state
    const [mounted, setMounted] = useState(false);
    const [thisSocket, setThisSocket] = useState(false)
    const socket = useSocketContext()
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, []);

    useEffect(() => {
        if (socket.connected === true && mounted === true) {
            if (thisSocket === false) {
                setThisSocket(socket)
                setChat({ data: 'n/a', dispatch });
            }
        }
    });

    return (
        <Authorization>
            <div>
                <Head>
                    <title>{`Welcome Home ${me.username}`}</title>
                    <meta name="Proxy's texting ground" content="Testing container for app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                WELCOME HOME
            </div>
        </Authorization>
    );
}

// ssr
export async function getServerSideProps(req) {
    // need users friends
    // list of servers
    const { id } = req.params
    return {
        props: { userID: id }
    };
};