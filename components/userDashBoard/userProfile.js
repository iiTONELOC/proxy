import { useEffect, useState } from "react";
import { hoverHandler } from "../navigation/NavLink";
export default function UserProfile({ userProfile, username, friends, location }) {
    const [mounted, setMounted] = useState(false);
    const [hover, setHover] = useState(false);
    const listOptions = [
        { section: 'Username', data: username },
        { section: 'Current Location', data: `${location.city}, ${location.state}` },
        {
            section: 'Bio',
            data: userProfile == null ?
                "Add a bio! No one likes a stranger!" : userProfile
        },
        { section: 'Total Friends', data: friends.length },
    ];
    function onHover() {
        return hoverHandler({ hover, setHover });
    };
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, []);

    if (!mounted) return null
    return (
        <ul className=' text-gray-400 p-3 h-full bg-gray-900 flex flex-col justify-between rounded-lg static' style={{ minWidth: 275 }}

        >
            {
                listOptions.map((item, index) => (
                    <li
                        key={item + `${index}`}
                        className={` flex flex-row p-1 px-2 justify-between items-center ${index < 3 ? 'border-black border-solid border-b-2' : null}`}
                    >
                        <span className='text-lg'>{item.section}: </span>
                        <span>{item.data}</span>
                    </li>
                ))}
        </ul>
    )
}