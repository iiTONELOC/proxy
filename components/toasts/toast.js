import { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { _REDUX_SET_TOAST } from '../../utilities/redux/actions';
import {
    generateRandomTwBgColor,
    genTailwindColorEquiv,
    variantColor,
    variantIcon
} from '../../utilities/utils';
export function closeToast(dispatch) {
    dispatch({
        type: _REDUX_SET_TOAST,
        clear: true
    });
};
const iconSize = '25px';
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
        <article className={`flex flex-row justify-between items-start ${randomColor ? randomColor : `bg-${variantColor(toast.type.type)}`} rounded-l-md`}>
            <div className={`h-full w-2 `}>
            </div>
            <div className="toast-body b rounded-l-md bg-gray-900  h-full flex justify-between">
                <section className='flex flex-row items-start gap-2 text-gray-200 p-2'>
                    <span className='flex flex-col justify-center items-center h-full w-1/6'> {variantIcon(toast.type, iconSize)} </span>
                    <span className='w-5/6 h-full'>
                        <h1 className={`text-lg block text-${randomColor ? 'gray-200' : `${variantColor(toast.type.type)}`}`}>{toast.type.notification}</h1>
                        <p className='text-md block'>{toast?.message}</p>
                    </span>
                </section>
                <button className="self-start m-1 p-2" onClick={() => closeToast(dispatch)}>
                    <AiOutlineClose color={genTailwindColorEquiv(toast.type.type)} size='20px' />
                </button>
            </div>
        </article>
    );
}