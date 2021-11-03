import Head from 'next/head';
import auth from '../../utilities/auth';
import { useEffect, useState } from 'react';
import Messaging from '../../components/chat';
import { useSelector, useDispatch } from 'react-redux';
import { setChat } from '../../utilities/redux/helpers';
import UsersInRange from '../../components/UsersInRange';
import Authorization from '../../components/Providers/Auth';
import serverClient from '../../utilities/apollo/server.config';
import { JOIN_GLOBAL_CHAT } from '../../utilities/socket/actions';
import { getMyFriendsList, getUsersInRange } from '../../utilities/graphql/userAPI';
import ResponsiveLayout from '../../components/responsive-layout/Responsive';
import { _REDUX_SET_CHAT, _REDUX_SET_FR } from '../../utilities/redux/actions';
import { SERVER_SIDE_FETCH_GLOBAL_MESSAGES } from '../../utilities/graphql/queries';
import { handleSocketConnection, useSocketContext } from '../../components/Providers/Chat';

export default function Global_Chat({ globalMessages }) {
    const dispatch = useDispatch();
    const socket = useSocketContext();
    const state = useSelector(st => st);
    const { usersInRange } = { ...state };
    const [joined, setJoined] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [thisSocket, setThisSocket] = useState(null);


    useEffect(() => {
        setMounted(true);
        if (mounted) {
            handleSocketConnection(setThisSocket, thisSocket, socket);
            getUsersInRange(dispatch);
            getMyFriendsList(dispatch);
        }
        return () => { setMounted(false); setJoined(false); setThisSocket(null) }
    }, [mounted]);

    useEffect(() => {
        if (mounted === true && thisSocket && !joined && usersInRange) {
            const payload = usersInRange;
            thisSocket.emit(JOIN_GLOBAL_CHAT, payload);
            setChat({ data: 'Global', dispatch });
            setJoined(true);
        }
    })

    if (mounted === false) return null
    if (!globalMessages) {
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
                {
                    auth.loggedIn() ?
                        <ResponsiveLayout
                            viewData={{
                                UsersInRange: { Element: UsersInRange },
                                Messaging: { Element: Messaging, props: { chatName: 'Global Chat', globalMessages: globalMessages } },
                            }}
                        />
                        : null
                }
            </div>
        </Authorization>
    );
};

// ssr
export async function getServerSideProps(req) {

    const globalMessages = await serverClient.query({
        query: SERVER_SIDE_FETCH_GLOBAL_MESSAGES, fetchPolicy: "network-only"
    });
    const msgError = globalMessages.errors;
    const msgData = globalMessages.data;
    if (msgError) {
        console.log("Error retrieving data in the Global-Chat", msgError);
    };
    return {
        props: { globalMessages: msgData }
    };
};

