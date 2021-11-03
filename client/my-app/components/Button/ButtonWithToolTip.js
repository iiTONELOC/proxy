import Button from "./Button";
import { useState, useEffect } from "react";
import { hoverHandler } from "../navigation/NavLink";
/*
Creates a custom button with tooltip
// EXAMPLE USAGE:
const iconSize = '30px'
const iconColor = 'text-gray-400'
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
                toolTip: {
                    classNames: {

                    }
                }
            },
        },
*/
export default function ButtonWithToolTip({ user, dispatch, ...props }) {
    const { Icon, toolTip, action, settings, iconSize } = props;
    const [isMounted, setMounted] = useState(false);
    const [hover, setHover] = useState(false);
    function onHover() {
        return hoverHandler({ hover, setHover });
    };
    useEffect(() => {
        setMounted(true);
        console.log(user)
        return () => setMounted(false);
    }, []);
    if (!isMounted) return null
    return (
        <span
            className="static flex flex-col items-center w-full"
            onMouseEnter={onHover}
            onMouseLeave={onHover}

            onClick={() => alert(action)}
        >
            <Button
                color={{ color: `${settings.button.color}`, hover: `${settings.button.hover}` }}
                radius={'rounded-md'}
                class={`${settings.icon.color} text-center p-1`}
            >
                {<Icon size={iconSize} />}
            </Button>
            {
                hover === true ?
                    <span
                        className={`absolute text-sm text-center text-white  bg-black rounded-lg p-1 mt-12 ${settings?.toolTip?.classNames ? settings?.toolTip?.classNames : ''}`}>
                        <p>{toolTip}</p>
                    </span>
                    : null

            }
        </span>
    )
}