import { useEffect, useState } from "react";
import { FaUserSecret } from 'react-icons/fa'
import { generateRandomTwBgColor } from "../../clientUtilities/utils";

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
                    (<span
                        className='p-1 bg-black rounded-xl'>
                        <img
                            src={profilePicture}
                            style={{ width: `${size}`, height: `${size}` }}
                            className='object-cover rounded-xl border-solid border-gray-900 border-3'

                        />
                    </span>)
                    :
                    (<span className={`${color ? `${color}` : `${randomColor}`} p-1  rounded-2xl flex justify-center`}>
                        <FaUserSecret size={size} />
                    </span>)
            }
        </div>
    );
};


