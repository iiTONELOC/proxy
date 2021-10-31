import Head from 'next/head';
import {
    SERVER_SIDE_FETCH_USER,
    SERVER_SIDE_FETCH_GLOBAL_MESSAGES
} from '../../utilities/graphql/queries';
import { useEffect, useState } from 'react';
import Messaging from '../../components/chat';
import { useSelector, useDispatch } from 'react-redux';
import { setChat, updateIncomingRequests, SetUsersInRage } from '../../utilities/redux/helpers';
import UsersInRange from '../../components/UsersInRange';
import Authorization from '../../components/Providers/Auth';
import serverClient from '../../utilities/apollo/server.config';
import { _REDUX_SET_CHAT, _REDUX_SET_FR } from '../../utilities/redux/actions';
import { JOIN_GLOBAL_CHAT } from '../../utilities/socket/actions';
import { useSocketContext } from '../../components/Providers/Chat';
import ResponsiveLayout from '../../components/responsive-layout/Responsive';
import { setUsersInfo } from '../../utilities/redux/helpers';


export default function Global_Chat({ userData, globalMessages }) {
    const dispatch = useDispatch();
    // the useSelector is necessary to access our state
    const state = useSelector((state) => state);
    const { me, currentChat } = { ...state }
    const [mounted, setMounted] = useState(false);
    const [thisSocket, setThisSocket] = useState(null)
    const [joined, setJoined] = useState(false)
    const socket = useSocketContext();

    function handleSocketConnection() {
        if (socket.connected === true && !thisSocket) {
            console.log(`socket global`, userData)
            return setThisSocket(socket)
        } else if (thisSocket) {
            return
        }
        else if (socket.connected === false) {
            setTimeout(() => {
                console.log('Socket Connection lagging, reattempting a connection...')
                handleSocketConnection()
            }, 550)
        }
    }
    useEffect(() => {
        setMounted(true)
        return () => { setMounted(false); setJoined(false); setThisSocket(null) }
    }, [])

    useEffect(() => {
        if (userData !== undefined && userData !== null && mounted === true && me) {
            // REDUX HANDLERS
            setUsersInfo({ userData, dispatch });
            updateIncomingRequests({ data: userData.incomingRequests, dispatch });
            handleSocketConnection()
        }
    }, [mounted])




    useEffect(() => {
        if (thisSocket && joined === false && userData) {


            console.log(`JOINING GLOBAL CHAT`)
            const payload = userData.usersInRange;
            thisSocket.emit(JOIN_GLOBAL_CHAT, payload);
            setChat({ data: 'Global', dispatch });
            setJoined(true)
        };
    }, [thisSocket])


    if (mounted === false) return null
    if (!userData && !globalMessages) {
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
                {userData ? <ResponsiveLayout viewData={{
                    UsersInRange: { Element: UsersInRange, props: { inRange: userData.usersInRange } },
                    Messaging: { Element: Messaging, props: { chatName: 'Global Chat', globalMessages: globalMessages } },
                }} /> : null}

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
    const globalMessages = await serverClient.query({
        query: SERVER_SIDE_FETCH_GLOBAL_MESSAGES, fetchPolicy: "network-only"
    });
    const msgError = globalMessages.errors;
    const msgData = globalMessages.data;
    if (error || msgError) {
        console.log("Error retrieving data in the Global-Chat", error ? error : msgError);
    };
    return {
        props: { userData: data.user, globalMessages: msgData }
    };
};

