import NavLink from "./NavLink";
import auth from "../../clientUtilities/auth";
import { useEffect, useState } from "react";
import { FaUserSecret } from 'react-icons/fa';
import AlertIcon from "../alertIcon/AlertIcon";
import { GiSatelliteCommunication } from 'react-icons/gi';


export function logoutUser() {
    return auth.logout();
}
const LoggedInDestinations = [
    { name: "Notification Icon", icon: <AlertIcon /> },
    { name: "User Settings", icon: <FaUserSecret size='30px' /> },
];

const destinations = [
    { name: "Sign In", location: "/sign-in" },
    { name: "Sign Up", location: "/sign-up" },
];
export default function NavBar() {
    const [mounted, setMounted] = useState(false);
    const [userID, setID] = useState(null);

    useEffect(() => {
        setMounted(true);
        const loggedIn = auth.getProfile();
        const { data } = loggedIn ? loggedIn : {};
        if (data?._id) {
            setID(data._id);
        }
        return () => setMounted(false);
    }, []);
    if (!mounted) return null;

    return (
        <>
            <header
                className="bg-gray-800 flex flex-row justify-between p-2 items-center border-t-2 border-green-400"
                style={{ height: "65px" }}
            >
                <div className="h-12 w-12 flex items-center justify-center bg-gray-700 rounded-full">
                    <GiSatelliteCommunication size="45px" color="#02e009" />
                </div>
                <nav className=" flex  flex-row w-4/5 justify-end text-white">
                    <ul className="flex flex-wrap justify-end w-full ">
                        {!userID
                            ? destinations.map((dest) => (
                                <NavLink key={dest.name} {...dest} />
                            ))
                            : LoggedInDestinations.map((dest) => (
                                <NavLink key={dest.name} {...dest} />
                            ))}
                    </ul>
                </nav>
            </header>
        </>
    );
}
