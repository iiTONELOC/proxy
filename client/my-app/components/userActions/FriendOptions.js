import { HiMail } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { GoDiffRemoved } from 'react-icons/go';
import { AiOutlineProfile } from 'react-icons/ai';
import ButtonWithToolTip from '../Button/ButtonWithToolTip';
import { _REDUX_SET_MODAL } from '../../utilities/redux/actions';

const iconSize = '25px';
const iconColor = 'text-gray-400';
const options = [
    {
        toolTip: 'View Profile',
        Icon: AiOutlineProfile,
        iconSize: iconSize,
        action: 'viewProfile',
        settings: {
            button: {
                color: 'gray-800',
                hover: 'purple-500'
            },
            icon: {
                color: iconColor
            },
        },
    },
    {
        toolTip: 'Send Message',
        Icon: HiMail,
        iconSize: iconSize,
        action: 'sendMessage',
        settings: {
            button: {
                color: 'gray-800',
                hover: 'gray-500'
            },
            icon: {
                color: iconColor
            }
        },
    },
    {
        toolTip: 'Remove Friend',
        Icon: GoDiffRemoved,
        iconSize: iconSize,
        action: 'removeFriend',
        settings: {
            button: {
                color: 'gray-800',
                hover: 'red-500'
            },
            icon: {
                color: iconColor
            }
        },
    },
];

export default function FriendOptions({ user }) {
    const dispatch = useDispatch();
    const [isMounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, []);
    if (!isMounted) return null

    return (
        <div className='p-1 flex justify-between items-center w-full ' style={{ width: '95px' }}>
            {
                options.map(option => (
                    <ButtonWithToolTip
                        key={option.toolTip + `${Date.now()}`}
                        dispatch={dispatch}
                        user={user}
                        {...option}
                    />
                ))
            }
        </div>
    );
};
