import { useEffect, useState } from "react";
import SideBar from "../navigation/SideBar";
import { MdCloudUpload } from 'react-icons/md';
import { hoverHandler } from "../navigation/NavLink";
import { useDispatch, useSelector } from "react-redux";
import ButtonWithToolTip from "../Button/ButtonWithToolTip";
import AvatarWithStatus from "../userAvatar/AvatarWithStatus";
import { calculateHeight } from "../../lib/utils";
import { _REDUX_SET_MODAL } from "../../lib/redux/actions";
import UserProfile from "./userProfile";
import UserStatus from "./userStatus";

function calculateWidth() {
    return window?.innerWidth - 58;
};
const buttonSettings = {
    button: {
        color: 'gray-400',
        hover: 'blue-400'
    },
    icon: {
        color: 'text-gray-600'
    },
    toolTip: {
        classNames: 'mt-20 text-medium p-2 bg-blue-500 border-2 border-black drop-shadow-lg',
    },
};
export default function UserDashBoard() {
    const [mounted, setMounted] = useState(false);
    const [hover, setHover] = useState(false);
    const state = useSelector(state => state);
    const [pic, setPicture] = useState(null);
    const dispatch = useDispatch();
    const { me, picture } = state;
    const { profile, location, status, friends, servers, username } = me
    const userProfile = profile?.bio
    const profileData = {
        username,
        userProfile,
        status,
        friends,
        location
    }

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, []);
    useEffect(() => {
        if (mounted) {
            setPicture(picture)
        }
    }, [picture]);
    function onHover() {
        return hoverHandler({ hover, setHover });
    };
    function handleUpload(e, dispatch, data) {
        e.preventDefault();
        return dispatch({
            type: _REDUX_SET_MODAL,
            modalView: { view: 'uploadProfilePicture', data: { me, setProfile: true } },
            toggle: true
        });
    };

    if (!mounted) return null;
    return (
        <section className='w-full flex flex-row ' style={{ height: calculateHeight() }}>
            <div className="bg-gray-600 w-14 h-full p-0" > <SideBar /> </div>
            <div className=' flex flex-row justify-center items-center overflow-y-auto' style={{ width: calculateWidth() }}>
                <section
                    className=' bg-gray-700 w-5/6 h-full flex flex-col justify-start items-start gap-2 '
                >
                    <header className='w-full my-2 p-2'>
                        <h1 className='text-2xl text-white font-bold'> Welcome Back, {me?.username}!</h1>
                    </header>
                    <div className='w-full h-full flex flex-col justify-start items-center bg-gray-700 gap-2 '>
                        <div className="w-full flex flex-col  justify-start gap-3 p-3">
                            <section
                                className="w-full flex flex-col md:justify-start lg:justify-between gap-5 bg-gray-800 p-2 rounded-lg"
                            >
                                <div className='flex flex-row justify-between'>
                                    <span
                                        className='static flex flex-row justify-start items-center bg-black rounded-lg'
                                        onMouseEnter={onHover}
                                        onMouseLeave={onHover}
                                    >
                                        <AvatarWithStatus
                                            picture={pic}
                                            user={me}
                                            size='250px'
                                            statusSize='50px'
                                            statusStyle={{
                                                marginLeft: -18,
                                                marginTop: -16,
                                            }}
                                        />
                                        {hover &&
                                            <span
                                                className='absolute flex flex-col h-full items-center justify-center p-2'
                                            >
                                                <ButtonWithToolTip
                                                    toolTip='Edit picture'
                                                    Icon={MdCloudUpload}
                                                    iconSize='55px'
                                                    settings={buttonSettings}
                                                    action={handleUpload}
                                                    dispatch={dispatch}
                                                    user={me}
                                                />
                                            </span>
                                        }
                                    </span>
                                    <UserStatus />
                                </div>
                                <UserProfile {...profileData} />
                            </section>
                        </div>
                        {/* <div className=" w-full  bg-green-500">2</div>
                        <div className=" w-full bg-yellow-500">3</div> */}
                    </div>
                </section>
            </div>
        </section>
    );
};

