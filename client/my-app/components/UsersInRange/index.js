import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import UserItem from '../userItem/UserItem';
import { GiHamburgerMenu } from "react-icons/gi";
import ButtonWithToolTip from '../Button/ButtonWithToolTip';
const btnData = {
    toolTip: 'Adjust Range',
    Icon: GiHamburgerMenu,
    iconSize: '20px',
    action: 'adjust range',
    settings: {
        button: {
            color: 'gray-800',
            hover: 'purple-500'
        },
        icon: {
            color: 'bg-gray-400'
        },
        toolTip: {
            classNames: {
            }
        }
    },
};
const rangeOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
export default function UsersInRange() {
    const [mounted, setMounted] = useState(false);
    const state = useSelector((state) => state);
    const [proxies, setProxies] = useState([]);
    const [range, setRange] = useState(5);
    const { usersInRange } = state;
    const [show, setShow] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => { setMounted(false) };
    }, []);
    useEffect(() => {
        setProxies(usersInRange);
    }, [usersInRange]);
    if (mounted == false) return null;

    return (

        <section className='bg-gray-800 rounded p-2 flex  flex-col justify-center text-white'>

            <header className='w-full flex flex-row justify-between text-center p-2'>
                <span > <ButtonWithToolTip {...btnData} /></span>

                <span >{range} miles</span>

            </header>
            <span>{show && <button />}</span>
            <div className='max-h-40 p-1 overflow-x-hidden overflow-y-auto'>
                {proxies.length > 0 ? proxies.map(user => (
                    <UserItem key={user._id} user={user} />
                )
                ) : <p className='text-center'>No one is around !</p>
                }
            </div>
        </section>

    );
};