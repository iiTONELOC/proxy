import { useEffect, useState } from "react";
import { FaUserSecret } from 'react-icons/fa'
import { generateRandomTwBgColor } from "../../utilities/utils";

// props = size, color
// size = height, pixels 
// color = backgroundColor
export default function Avatar(props) {
    const [mounted, setMounted] = useState(null);
    const { size, color, profilePicture } = props;
    const [randomColor, setRandom] = useState(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(null);
    }, []);
    useEffect(() => {
        if (mounted) {
            setRandom(generateRandomTwBgColor());
        };
    }, [mounted]);
    if (!mounted) return null;

    return (
        <div className="flex justify-center items-center">
            {
                profilePicture ?
                    (<span style={{ height: `${size}` }}>
                        <img src={profilePicture} style={{ objectFit: 'contain' }} />
                    </span>)
                    :
                    (<span className={color ? `${color}` : `${randomColor}`}>
                        <FaUserSecret size={size} />
                    </span>)
            }
        </div>
    );
};


