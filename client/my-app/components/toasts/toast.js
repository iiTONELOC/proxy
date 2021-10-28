import { TiWarning } from 'react-icons/ti';
import { useState, useEffect } from 'react';
import { MdDangerous } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { RiErrorWarningFill } from 'react-icons/ri';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { _REDUX_SET_TOAST } from '../../utilities/redux/actions';
import { generateRandomTwBgColor, genTailWindColorEquiv } from '../../utilities/utils';

const iconSize = '25px';

function toastColor(type) {
    console.log(type, `TOAST`)
    switch (type) {
        case 'danger':
            return `bg-red-500`
        case 'success':
            return `bg-green-400`
        case 'warning':
            return `bg-yellow-400`
        case 'info':
            return `bg-blue-400`
        case 'custom':
            return `${type.customBg}`
        default:
            return generateRandomTwBgColor()
    }
};
function toastIcon(Type) {
    switch (Type.type) {
        case 'danger':
            return <MdDangerous style={{ color: genTailWindColorEquiv(Type.type) }} size={iconSize} />
        case 'success':
            return <BsFillCheckCircleFill style={{ color: genTailWindColorEquiv(Type.type) }} size={iconSize} />
        case 'warning':
            return <TiWarning style={{ color: genTailWindColorEquiv(Type.type) }} size={iconSize} />
        case 'info':
            return <RiErrorWarningFill style={{ color: genTailWindColorEquiv(Type.type) }} size={iconSize} />
        case 'custom':
            return <Type.CustomIcon />
        default:
            break;
    }
};

function closeToast(dispatch) {
    dispatch({
        type: _REDUX_SET_TOAST,
        clear: true
    });
};


export default function Toast({ timeout }) {
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    const { toast } = state;
    const [mounted, setMounted] = useState(false);
    const [randomColor, setRandom] = useState(null);

    useEffect(() => {
        setMounted(true);

        return () => setMounted(false)
    }, []);
    useEffect(() => {
        if (mounted === true && toast) {

            console.log(`TOAST DATA`, toast)
            if (toast.type.type === 'undefined') {
                setRandom(generateRandomTwBgColor())
            };
            setTimeout(() => {
                closeToast(dispatch)
            }, timeout ? timeout : 7500);
        }
    }, [mounted]);
    if (mounted !== true || !toast) return null;
    return (
        <article className={`h-16  flex flex-row justify-between items-start ${randomColor ? randomColor : `${toastColor(toast.type.type)}`} rounded-l-md`}>
            <div className={`h-full w-2 `}>
            </div>
            <div className="toast-body b rounded-l-md bg-gray-900 h-full p-1 flex justify-between">
                <section className='flex flex-row items-start gap-2 text-gray-200'>
                    <span className='flex flex-col justify-center items-center h-full w-1/6'> {toastIcon(toast.type)} </span>
                    <span className='w-5/6 h-full'>
                        <h1 className='text-sm block'>{toast.type.notification}</h1>
                        <p className='text-sm block'>{toast?.message}</p>
                    </span>

                </section>

                <button className="btn btn-sm btn-outline-danger self-start" onClick={() => closeToast(dispatch)}>
                    <AiOutlineClose color={ } />
                </button>
            </div>

        </article>
    );
}