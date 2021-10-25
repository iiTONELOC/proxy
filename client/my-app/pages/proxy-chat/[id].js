import Head from 'next/head';
import { useEffect, useState } from 'react';
import UsersInRange from '../../components/UsersInRange';
import Authorization from '../../components/Providers/Auth';
import serverClient from '../../utilities/apollo/server.config';
import { SERVER_SIDE_FETCH_USER } from '../../utilities/graphql/queries';
import ResponsiveLayout from '../../components/responsive-layout/Responsive';
import { useSocketContext } from '../../components/Providers/Chat';
import { useSelector, useDispatch } from 'react-redux';
import { JOIN_GLOBAL_CHAT } from '../../utilities/socket/actions';
import Messaging from '../../components/messaging';
import { _REDUX_SET_CHAT } from '../../utilities/redux/actions';
import { setChat } from '../../utilities/redux/helpers';
export default function Global_Chat({ userData }) {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    // the useSelector is necessary to access our state
    const [mounted, setMounted] = useState(false);
    const [thisSocket, setThisSocket] = useState(false)
    const { me, currentChat } = state
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
            console.log(`TRYING TO JOIN CHAT`)

            // emit to the chat server that we are joining the chat in, and send our usersInRange List so we can notify the users

            if (currentChat !== null) {
                console.log(`HERE`, state.currentChat)
                if (currentChat !== 'Global') {
                    thisSocket.emit(JOIN_GLOBAL_CHAT)
                    setChat({ data: 'Global', dispatch })
                } return
            } else {
                thisSocket.emit(JOIN_GLOBAL_CHAT)
                setChat({ data: 'Global', dispatch })
            }

        }
    }, [thisSocket])

    if (!userData) {
        return `Loading`
    }

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
                    Messaging: { Element: Messaging },
                }} />
            </div>
        </Authorization>
    );
};


export async function getServerSideProps(req) {

    // const userID = req.socket.parser.incoming.url.split('/')[2];
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
        props: { userData: data.user }, // will be passed to the page component as props
    };
};

