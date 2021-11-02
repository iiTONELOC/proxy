import Head from 'next/head';
import {
    SERVER_SIDE_FETCH_GLOBAL_MESSAGES,
} from '../../utilities/graphql/queries';
import { useEffect, useState } from 'react';
import Messaging from '../../components/chat';
import { useSelector, useDispatch } from 'react-redux';
import { setChat } from '../../utilities/redux/helpers';
import UsersInRange, { updateUsersInRangeHandler } from '../../components/UsersInRange';
import Authorization from '../../components/Providers/Auth';
import serverClient from '../../utilities/apollo/server.config';
import { _REDUX_SET_CHAT, _REDUX_SET_FR } from '../../utilities/redux/actions';
import { JOIN_GLOBAL_CHAT } from '../../utilities/socket/actions';
import { useSocketContext } from '../../components/Providers/Chat';
import ResponsiveLayout from '../../components/responsive-layout/Responsive';
import auth from '../../utilities/auth';

async function getInRangeData(dispatch) { await updateUsersInRangeHandler(dispatch) }
export function handleSocketConnection(setThisSocket, thisSocket, socket) {
    if (socket.connected === true && !thisSocket) {
        return setThisSocket(socket);
    } else if (thisSocket) {
        return
    }
    else if (socket.connected === false) {
        setTimeout(() => {
            handleSocketConnection(setThisSocket, thisSocket, socket);
        }, 550);
    };
};
export default function Global_Chat({ globalMessages }) {
    const dispatch = useDispatch();
    // the useSelector is necessary to access our state
    const state = useSelector((state) => state);
    const { usersInRange } = { ...state }
    const [mounted, setMounted] = useState(false);
    const [thisSocket, setThisSocket] = useState(null)
    const [joined, setJoined] = useState(false)
    const socket = useSocketContext();

    useEffect(() => {
        setMounted(true);
        if (mounted) {
            handleSocketConnection(setThisSocket, thisSocket, socket);
            getInRangeData(dispatch);
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
                {auth.loggedIn() ? <ResponsiveLayout viewData={{
                    UsersInRange: { Element: UsersInRange },
                    Messaging: { Element: Messaging, props: { chatName: 'Global Chat', globalMessages: globalMessages } },
                }} /> : null}
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

