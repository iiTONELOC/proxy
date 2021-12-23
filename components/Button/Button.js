import { useState, useEffect } from "react"
import { hoverHandler } from "../navigation/NavLink";

export default function Button({ children, action, ...props }) {
    const [isMounted, setMounted] = useState(false);
    const [hover, setHover] = useState(false);
    const [activeColor, setActiveColor] = useState();
    function onHover() {

        hoverHandler({ hover, setHover });
        // backwards it wont register the change right away
        setActiveColor(!hover ? props.color.hover : props.color.color);
    }
    useEffect(() => {
        setMounted(true);
        setActiveColor(props.color.color);
        return () => setMounted(false)
    }, [])
    if (!isMounted) return null

    const { color, radius, ...rest } = props;
    const { onSubmit, onClick } = action ? action : {};
    return (
        <button
            className={` bg-${activeColor} ${radius ? `${radius}` : 'rounded-sm'} ${rest.class ? rest.class : null}`}
            onMouseEnter={onHover}
            onMouseLeave={onHover}
            onClick={onClick ? onClick : null}
            onSubmit={onSubmit ? onSubmit : null}
        > {children}</button>
    )

}