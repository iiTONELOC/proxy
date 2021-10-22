import NavLink from "./NavLink"
import { useEffect, useState } from 'react';
import auth from "../../utilities/auth";
export function logoutUser() {
    return auth.logout();
}

export default function NavBar() {
    const [mounted, setMounted] = useState(false);
    const [userID, setID] = useState(null);

    const LoggedInDestinations = [
        { name: 'Home', location: '/' },
        { name: 'Proxy-Chat', location: `/proxy-chat/${userID}` },
        { name: 'Logout', onClick: logoutUser, },
    ];

    const destinations = [
        { name: 'Home', location: '/' },
        { name: 'Sign In', location: '/sign-in' },
        { name: 'Sign Up', location: '/sign-up' },
    ];
    useEffect(() => {
        console.log(`NavBar is mounting`);
        setMounted(true);
        const loggedIn = auth.getProfile();
        const { data } = loggedIn ? loggedIn : {}
        if (data._id) {
            setID(data._id)
        }
        return () => setMounted(false)
    }, []);
    if (!mounted) return null;

    return (
        <>
            <header className="bg-gray-800 flex flex-row justify-between p-2 items-center border-t-2 border-green-400" style={{ height: '65px' }}>
                <div className="bg-gray-400 rounded-full h-12 w-12 flex items-center justify-center">Proxy</div>
                <nav className=" flex  flex-row w-4/5 justify-end text-white">
                    <ul className="flex flex-wrap justify-end w-full ">
                        {
                            !userID ? destinations.map(dest => (<NavLink key={dest.name} {...dest} />)) :
                                LoggedInDestinations.map(dest => (<NavLink key={dest.name} {...dest} />))
                        }
                    </ul>
                </nav>
            </header>
        </>
    );
};