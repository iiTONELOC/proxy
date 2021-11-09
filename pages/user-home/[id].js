import Head from 'next/head';
import auth from '../../utilities/auth';
import { useEffect, useState } from 'react';
import { MdCloudUpload } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { setChat } from '../../utilities/redux/helpers';
import Authorization from '../../components/Providers/Auth';
import { useSocketContext } from '../../components/Providers/Chat';
import { _REDUX_SET_MODAL } from '../../utilities/redux/actions';
import ButtonWithToolTip from '../../components/Button/ButtonWithToolTip';
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
    function GenLandingPage() {
        return (
            <section className='w-full h-full flex flex-row flex-wrap justify-center items-center self-start'>
                <div className='mt-2 bg-black w-96 flex flex-row justify-evenly items-center rounded-lg text-gray-400'>
                    <span className='text-gray-400'>
                        Change current picture
                    </span>
                    <span>
                        <ButtonWithToolTip
                            toolTip='upload-profile'
                            Icon={MdCloudUpload}
                            iconSize='55px'
                            action='viewProfile'
                            settings={{
                                button: {
                                    color: 'gray-800',
                                    hover: 'blue-400'
                                },
                                icon: {
                                    color: 'gray-400'
                                },
                                toolTip: {
                                    classNames: 'mt-20 text-medium p-2 bg-blue-500 border-2 border-black drop-shadow-lg',
                                },

                            }}
                            action={(e, dispatch, data) => {
                                e.preventDefault();
                                dispatch({
                                    type: _REDUX_SET_MODAL,
                                    modalView: { view: 'uploadProfilePicture', data: me },
                                    toggle: true
                                });
                            }}
                            dispatch={dispatch}
                            user={me}
                        />
                    </span>

                </div>

            </section>
        )
    }
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

                                Landing: { Element: GenLandingPage, props: me },
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
    return {
        props: { userID: id }
    };
};