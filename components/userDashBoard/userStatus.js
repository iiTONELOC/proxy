import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hoverHandler } from "../navigation/NavLink";
export default function UserStatus() {

    const [mounted, setMounted] = useState(false);
    const state = useSelector((state) => state);
    const [hover, setHover] = useState(false);
    const [myStatus, setMyStatus] = useState(null);
    const { me } = state;
    const listOptions = [
        { section: 'Status', data: myStatus?.status },
        { section: 'Online', data: myStatus?.online ? 'Online' : 'Offline' },
        { section: 'Visibility', data: me?.profile?.visible ? 'Visible' : 'Hidden' },
    ];
    function onHover() {
        return hoverHandler({ hover, setHover });
    };
    useEffect(() => {
        setMounted(true);
        setMyStatus(me.status);
        return () => setMounted(false)
    }, [me]);

    if (!mounted) return null
    return (
        <ul className=' text-gray-400 p-3  bg-gray-900 flex flex-col justify-start rounded-lg static' style={{ minWidth: 275 }}
        >
            {
                listOptions.map((item, index) => (
                    <li
                        key={item + `${index}`}
                        className={` flex flex-row p-1 px-2 justify-between items-center ${index < 3 ? 'border-black border-solid border-b-2' : null}`}
                    >
                        <span className='text-lg'>{item.section}: </span>
                        <span className={`${item.data === 'Online' ? `text-green-400` : 'text-gray-400'} italic`}>{item.data}</span>
                    </li>
                ))
            }
        </ul>

    )
}