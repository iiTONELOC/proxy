import { CgOptions } from 'react-icons/cg'
import { useState, useEffect } from 'react';
import Button from '../Button/Button';
import { useDispatch } from 'react-redux';
import { _REDUX_SET_MODAL } from '../../utilities/redux/actions';
import { AiOutlineProfile } from 'react-icons/ai';
import { HiMail } from 'react-icons/hi';
import { GoDiffRemoved } from 'react-icons/go';
const iconSize = '30px'

export default function FriendOptions(props) {
    const dispatch = useDispatch();
    const [viewProfileBtnState, setViewProfileBtnState] = useState(false);
    const [sendMsgBtnState, setSendMsgBtnState] = useState(false);
    const [removeFriendBtnState, setRemoveFriendBtnState] = useState(false);
    const [isMounted, setMounted] = useState(false);
    const options = [
        {
            toolTip: 'View Profile',
            icon: AiOutlineProfile,
            action: 'viewProfile',
            props: {
                color: {
                    color: 'gray-800',
                    hover: 'purple-500'
                }
            },
            state: viewProfileBtnState,
            stateHandler: () => { setViewProfileBtnState(!viewProfileBtnState) }
        },
        {
            toolTip: 'Send Message',
            icon: HiMail,
            action: 'sendMessage',
            props: {
                color: {
                    color: 'gray-800',
                    hover: 'gray-500'
                }
            },
            state: sendMsgBtnState,
            stateHandler: () => { setSendMsgBtnState(!sendMsgBtnState) }
        },
        {
            toolTip: 'Remove Friend',
            icon: GoDiffRemoved,
            action: 'removeFriend',
            props: {
                color: {
                    color: 'gray-800',
                    hover: 'red-500'
                }
            },
            state: removeFriendBtnState,
            stateHandler: () => { setRemoveFriendBtnState(!removeFriendBtnState) }
        },
    ];
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, [])
    if (!isMounted) return null

    return (
        <div className='p-1 flex justify-between items-center w-full'>
            {
                options.map((option, index) => (
                    <span
                        key={option.action + `${index}`}
                        className="static flex flex-col items-center w-full"
                        onMouseEnter={option.stateHandler}
                        onMouseLeave={option.stateHandler}

                        onClick={() => alert(option.action)}
                    >
                        <Button
                            color={{ color: `${option.props.color.color}`, hover: `${option.props.color.hover}` }}
                            radius={'rounded-md'}
                            class='text-gray-400 text-center p-1'
                            toolTip={option.toolTip}
                        >
                            <option.icon size={iconSize} key={'friendIconOption' + `${index}`} />
                        </Button>
                        {
                            option.state === true ?
                                <span
                                    className={`absolute text-sm text-center text-white  bg-black rounded-lg p-1 mt-12`}>
                                    {option.toolTip}
                                </span>
                                : null

                        }
                    </span>
                ))
            }

        </div>
    );
};
