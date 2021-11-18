import SideBar from '../navigation/SideBar';
import Toast from '../toasts/toast';
import { Modal } from '../modal';
import { NotificationList } from '../notificationList/NotificationList';
import FriendsList from '../friendsList/friendsList';
import { useEffect, useState } from 'react';
import { calculateHeight } from '../../clientUtilities/utils';

export default function DesktopLayout(
    {
        Messaging,
        InformationPane,
        UserDash,
        Landing,
        display,
        SignUp,
        Login,
        toast,
        modal
    }
) {
    const [mounted, setMounted] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(null)
    }, []);
    useEffect(() => {
        if (mounted) {
            window.addEventListener('resize', () => { setWindowWidth(window.innerWidth) });
        }

    }, [mounted]);
    return (
        <>
            {toast &&
                <span className='absolute w-full flex flex-row justify-end p-3' aria-hidden='true'>
                    <Toast />

                </span>

            }
            <NotificationList />
            <section className="static flex flex-row gap-2 justify-start h-full w-full" >
                {modal ? <Modal /> : null}

                {display !== 'single' ?
                    <>
                        <div className="bg-gray-600 w-14  p-0"> <SideBar /> </div>
                        <div
                            className="bg-gray-600 w-5/12  md:w-4/12 lg:w-3/12 p-1 flex flex-col gap-2"
                            style={{ minWidth: '325px' }}
                        >

                            <FriendsList />
                            {windowWidth < 1293 ? InformationPane ? <InformationPane.Element {...InformationPane.props} /> : null : null}
                        </div>
                        <div
                            className="bg-gray-600 w-7/12  md:w-8/12 lg:w-9/12 p-1 h-full flex"
                        >
                            {Messaging ? <Messaging.Element {...Messaging.props} /> : `In progress`}
                            {windowWidth > 1293 ? InformationPane ? <div className='w-2/3 h-full  p-2'><InformationPane.Element {...InformationPane.props} /> </div> : null : null}

                        </div>
                    </> : /* single displays, ie no columns */
                    <>
                        <div className='bg-gray-900 w-full flex justify-center' style={{ height: calculateHeight() }}>
                            {Landing?.Element ? (<Landing.Element />) : null}
                            {UserDash?.Element ? (<UserDash.Element me={UserDash.props} />) : null}
                            {SignUp ? (<SignUp.Element form={SignUp.props} />) : null}
                            {Login ? (<Login.Element form={Login.props} />) : null}
                        </div>
                    </>
                }

            </section>
        </>
    )
}

