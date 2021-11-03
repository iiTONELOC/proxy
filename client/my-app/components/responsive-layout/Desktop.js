import SideBar from '../navigation/SideBar';
import Toast from '../toasts/toast';
import { Modal } from '../modal';
import { NotificationList } from '../notificationList/NotificationList';
import FriendsList from '../friendsList/friendsList';
export default function DesktopLayout(
    {
        Messaging,
        UsersInRange,
        Landing,
        display,
        SignUp,
        Login,
        toast,
        modal
    }
) {

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
                        <div className="bg-gray-600 w-5/12  md:w-4/12 lg:w-3/12 p-1 flex flex-col gap-2" style={{ minWidth: '300px' }}>{UsersInRange ? <UsersInRange.Element {...UsersInRange.props} /> : null} <FriendsList />  </div>
                        <div className="bg-gray-600 w-7/12  md:w-8/12 lg:w-9/12 p-1 h-full flex">{Messaging ? <Messaging.Element {...Messaging.props} /> : `In progress`}</div>
                    </> :
                    <>
                        <div className='bg-gray-900 w-2/3 lg:w-1/2  rounded-xl m-auto flex justify-center' style={{ height: '65vh' }}>
                            {Landing && <Landing />}
                            {SignUp ? (<SignUp.Element form={SignUp.props} />) : null}
                            {Login ? (<Login.Element form={Login.props} />) : null}
                        </div>
                    </>
                }

            </section>
        </>
    )
}

