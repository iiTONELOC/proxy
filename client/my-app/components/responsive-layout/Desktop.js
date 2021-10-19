
import SideBar from '../navigation/SideBar'
export default function DesktopLayout({ Information, Messaging, Test, Landing, display, SignUp, Login }) {


    return (
        <section className="flex flex-row gap-2 justify-start h-full w-full">
            {display !== 'single' ?
                <>
                    <div className="bg-yellow-300 w-14  p-0"> <SideBar /> </div>
                    <div className="bg-gray-600 w-5/12  md:w-4/12 lg:w-3/12 p-1">{Information ? <Information /> : Test ? <Test.Element allUsers={Test.props} /> : null}</div>
                    <div className="bg-gray-600 w-7/12  md:w-8/12 lg:w-9/12 p-1">{Messaging ? <Messaging /> : `In progress`}</div>
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
    )
}