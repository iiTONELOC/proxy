import { useState, useEffect } from "react"
import { hoverHandler } from "../navigation/NavLink";

export default function Button({ children, action, ...props }) {
    const [isMounted, setMounted] = useState(false);
    const [hover, setHover] = useState(false);
    function onHover() {
        return hoverHandler({ hover, setHover });
    }
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, [])
    if (!isMounted) return null

    const { color, radius, ...rest } = props;
    const { onSubmit, onClick } = action ? action : {};
    return (
        <button
            className={` bg-${color.color ? hover ? `${color.hover}` : `${color.color}` : 'gray-500'} ${radius ? `${radius}` : 'rounded-sm'} ${rest.class ? rest.class : null}`}
            onMouseEnter={onHover}
            onMouseLeave={onHover}
            onClick={onClick ? onClick : null}
            onSubmit={onSubmit ? onSubmit : null}
        > {children}</button>
    )

}