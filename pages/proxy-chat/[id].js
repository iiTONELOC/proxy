import Head from 'next/head';
import auth from '../../utilities/auth';
import { useEffect, useState } from 'react';
import Messaging from '../../components/chat';
import { useSelector, useDispatch } from 'react-redux';
import InformationPane from '../../components/information';
import Authorization from '../../components/Providers/Auth';
import { _REDUX_SET_CHAT, } from '../../utilities/redux/actions';
import { JOIN_GLOBAL_CHAT } from '../../utilities/socket/actions';
import ProxySearch from '../../components/information/proxySearch';
import { userQueries } from '../../lib/db/controller/user/queries';
import messageQueries from '../../lib/db/controller/messages/queries';
import ResponsiveLayout from '../../components/responsive-layout/Responsive';
import { reduxUpdateUserData, setChat } from '../../utilities/redux/helpers';
import { handleSocketConnection, useSocketContext } from '../../components/Providers/Chat';


export default function Global_Chat({ user, globalMessages }) {
    const dispatch = useDispatch();
    const socket = useSocketContext();
    const state = useSelector(st => st);
    const { usersInRange, } = { ...state };
    const [joined, setJoined] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [thisSocket, setThisSocket] = useState(null);
    const messages = globalMessages.map(el => JSON.parse(el));

    useEffect(() => {
        setMounted(true);
        if (mounted) {
            handleSocketConnection(setThisSocket, thisSocket, socket);
            const userData = JSON.parse(user)
            reduxUpdateUserData({ userData, dispatch })
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

                                Messaging: { Element: Messaging, props: { chatName: 'Global Chat', globalMessages: messages } },
                                InformationPane: { Element: InformationPane, props: { ProxySearch } }
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
    const { id } = req.params
    const msgData = await messageQueries.globalMessages();
    const user = await userQueries.serverFindMe({ args: { user: id } });
    const userData = JSON.stringify(user);
    const data = msgData.map(el => JSON.stringify(el));
    return {
        props: { user: userData, globalMessages: data }
    };
};

