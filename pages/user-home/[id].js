import Head from 'next/head';
import auth from '../../clientUtilities/auth';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserDashBoard from '../../components/userDashBoard';
import Authorization from '../../components/Providers/Auth';
import { _REDUX_SET_MODAL } from '../../clientUtilities/redux/actions';
import { userQueries } from '../../serverUtils/db/controller/user/queries';
import ResponsiveLayout from '../../components/responsive-layout/Responsive';
import { setChat, reduxUpdateUserData } from '../../clientUtilities/redux/helpers';
import { handleSocketConnection, useSocketContext } from '../../components/Providers/Socket';

export default function User_Home({ serverMe }) {
    const dispatch = useDispatch();
    const socket = useSocketContext()
    const state = useSelector(st => st);
    const [mounted, setMounted] = useState(false);
    const [thisSocket, setThisSocket] = useState(false)
    const { me } = state
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
    useEffect(() => {
        if (mounted) {
            handleSocketConnection(setThisSocket, thisSocket, socket);
            const userData = JSON.parse(serverMe);
            reduxUpdateUserData({ userData, dispatch })
        }
    }, [mounted])

    return (
        <Authorization>
            <div className='w-full h-full'>
                <Head>
                    <title>{`Welcome Home ${me?.username}`}</title>
                    <meta name="Proxy's texting ground" content="Testing container for app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                {
                    auth.loggedIn() ?
                        <ResponsiveLayout
                            viewData={{
                                UserDash: { Element: UserDashBoard },
                                display: 'single'
                            }}
                        />
                        : null
                }

            </div>
        </Authorization>

    );
}

// ssr
export async function getServerSideProps(req) {
    // need users friends
    // list of servers
    const { id } = req.params
    const user = await userQueries.serverFindMe({ args: { user: id } })

    const me = JSON.stringify(user);
    return {
        props: { serverMe: me }
    };
};