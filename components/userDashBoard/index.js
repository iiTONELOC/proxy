import Avatar from "../userAvatar/Avatar";
import { useEffect, useState } from "react";
import SideBar from "../navigation/SideBar";
import { MdCloudUpload } from 'react-icons/md';
import { useDispatch, useSelector } from "react-redux";
import ButtonWithToolTip from "../Button/ButtonWithToolTip";
import { _REDUX_SET_MODAL } from "../../clientUtilities/redux/actions";



function calculateWidth() {
    return window?.innerWidth - 58
}

export default function UserDashBoard() {
    const [mounted, setMounted] = useState(false);
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const { me } = state
    useEffect(() => {
        setMounted(true);
        console.log(me)
        return () => setMounted(false)
    }, []);

    if (!mounted) return null
    return (
        <section className='w-full h-full flex flex-row'>
            <div className="bg-gray-600 w-14 h-full p-0" > <SideBar /> </div>

            <div className=' h-full flex flex-row justify-center items-center' style={{ width: calculateWidth() }}>

                <section
                    className=' bg-gray-700 w-5/6 h-full flex flex-col justify-start items-start gap-2'
                >
                    <header className='w-full mt-2 p-2'>
                        <h1 className='text-2xl text-white font-bold'> Welcome Back, {me.username}!</h1>
                    </header>
                    <div className='w-full h-full flex flex-col justify-center items-center bg-black gap-2'>
                        <div className="w-full  bg-red-500 p-1 flex flex-row justify-between">
                            {/* <Avatar profilePicture={me.profile.profilePicture} /> */}
                        </div>
                        <div className=" w-full  bg-green-500"></div>
                        <div className=" w-full bg-yellow-500">3</div>
                    </div>

                    {/* ROW THAT HOLDS  */}
                    {/* UPLOAD COMPONENT */}


                </section>
            </div>




        </section>
    )
}

{/* <div className='mt-2 bg-gray-800 w-96 flex flex-row justify-evenly items-center rounded-lg text-gray-400'>
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
</div> */}