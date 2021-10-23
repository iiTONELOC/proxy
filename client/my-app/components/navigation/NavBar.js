import NavLink from "./NavLink";
import { useEffect, useState } from "react";
import auth from "../../utilities/auth";
import client from "../../utilities/apollo/client.config";
import { LOGOUT } from "../../utilities/graphql/mutations";
import Link from "next/link";
export function logoutUser() {
    return auth.logout();
}

export default function NavBar() {
    const [mounted, setMounted] = useState(false);
    const [userID, setID] = useState(null);

    // need a logout handler, need to set the users status to offline
    // we can handle the updates in the chat server using socket
    async function handleLogout(e) {
        e.preventDefault();
        const loggedOutMutationResult = await client.mutate({ mutation: LOGOUT });
        console.log(loggedOutMutationResult);
        if (loggedOutMutationResult !== null) {
            logoutUser();
        }
    }
    const LoggedInDestinations = [
        { name: "Notification Icon" },
    ];

    const destinations = [
        { icon: "", name: "Home", location: "/" },
        { name: "Sign In", location: "/sign-in" },
        { name: "Sign Up", location: "/sign-up" },
    ];
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
            <header
                className="bg-gray-800 flex flex-row justify-between p-2 items-center border-t-2 border-green-400"
                style={{ height: "65px" }}
            >
                <div className="h-14 w-14 flex items-center justify-center">
                    <Link href="/">
                        <img
                            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2013%2F07%2F12%2F15%2F59%2Fproximity-150698_960_720.png&f=1&nofb=1"
                            alt=""
                        />
                    </Link>
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
