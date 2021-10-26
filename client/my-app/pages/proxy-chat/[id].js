import Head from 'next/head';
import { useEffect, useState } from 'react';
import Messaging from '../../components/chat';
import { useSelector, useDispatch } from 'react-redux';
import { setChat } from '../../utilities/redux/helpers';
import UsersInRange from '../../components/UsersInRange';
import Authorization from '../../components/Providers/Auth';
import serverClient from '../../utilities/apollo/server.config';
import { _REDUX_SET_CHAT } from '../../utilities/redux/actions';
import { JOIN_GLOBAL_CHAT } from '../../utilities/socket/actions';
import { useSocketContext } from '../../components/Providers/Chat';
import { SERVER_SIDE_FETCH_USER } from '../../utilities/graphql/queries';
import ResponsiveLayout from '../../components/responsive-layout/Responsive';


export default function Global_Chat({ userData }) {
    const dispatch = useDispatch();
    // the useSelector is necessary to access our state
    const state = useSelector((state) => state);
    const { me, currentChat } = state
    const [mounted, setMounted] = useState(false);
    const [thisSocket, setThisSocket] = useState(false)
    const socket = useSocketContext()
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, [])

    useEffect(() => {
        if (socket.connected === true) {
            if (thisSocket === false) {
                setThisSocket(socket)
            }
        }
    })
    useEffect(() => {
        if (mounted === true && thisSocket !== false) {
            const payload = userData.usersInRange
            if (currentChat !== null) {
                if (currentChat !== 'Global') {
                    thisSocket.emit(JOIN_GLOBAL_CHAT, payload);
                    setChat({ data: 'Global', dispatch });
                } return
            } else {
                thisSocket.emit(JOIN_GLOBAL_CHAT, payload);
                setChat({ data: 'Global', dispatch });
            };
        };
    }, [thisSocket]);

    if (!userData) {
        return `Loading`
    };

    return (
        <Authorization>
            <div>
                <Head>
                    <title>Proxy-Chat</title>
                    <meta name="Proxy's texting ground" content="Testing container for app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <ResponsiveLayout viewData={{
                    UsersInRange: { Element: UsersInRange, props: userData?.usersInRange },
                    Messaging: { Element: Messaging, props: { chatName: 'Global Chat' } },
                }} />
            </div>
        </Authorization>
    );
};

// ssr
export async function getServerSideProps(req) {
    const { id } = req.params
    const { data, error } = await serverClient
        .query(
            {
                query: SERVER_SIDE_FETCH_USER,
                variables: { user: id },
                fetchPolicy: "network-only"
            }
        );
    if (error) {
        console.log("Error retrieving data in the Global-Chat", error)
    };

    return {
        props: { userData: data.user }
    };
};

