import { FaHome, FaComments, FaSearch, FaAndroid, FiLogout } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { logoutUser } from './NavBar';
import auth from '../../utilities/auth';
import NavLink from './NavLink';
import client from "../../utilities/apollo/client.config";
import { LOGOUT } from "../../utilities/graphql/mutations";



export default function SideBar() {
    const [mounted, setMounted] = useState(false);
    const [userID, setID] = useState(null);
    const LoggedInSideBar = [
        { name: "Home", location: "/", icon: <FaHome size="32px" color="lightGrey" /> },
        { name: "Proxy-Chat", location: `/proxy-chat/${userID}`, icon: <FaComments size="32px" color="lightGrey" /> },
        { name: "Logout", onClick: handleLogout, icon: <FiLogOut size="32px" color="lightGrey" /> },
    ];
    async function handleLogout(e) {
        e.preventDefault();
        const loggedOutMutationResult = await client.mutate({ mutation: LOGOUT });
        console.log(loggedOutMutationResult);
        if (loggedOutMutationResult !== null) {
            logoutUser();
        }
    }
    useEffect(() => {
        console.log(`NavBar is mounting`);
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
            <section className="flex flex-col justify-start hover:bg-gray-600 rounded-md h-full">
                <nav className="flex flex-col h-2/3 mt-2">
                    <ul className="flex flex-col justify-start gap-3 h-full">
                        {userID ? LoggedInSideBar.map(link => (<NavLink key={link.name} {...link} />)) : null}
                    </ul>
                </nav>
            </section>
        </>
    );
}
