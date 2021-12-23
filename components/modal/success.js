import { useDispatch, } from 'react-redux';
import { useState, useEffect } from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { _REDUX_SET_MODAL } from '../../lib/redux/actions';

export default function SuccessModal({ timeout }) {
    const [mounted, setMounted] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, []);
    useEffect(() => {
        if (mounted === true) {
            setTimeout(() => {
                dispatch({
                    type: _REDUX_SET_MODAL,
                    modalView: 'null'
                });
            }, timeout);
        }
    }, [mounted]);


    return (
        <section className=' text-white p-2' style={{ height: '170x' }}>
            <div className="modal-header">
                <h3 className="text-center text-xl">Success!</h3>
            </div>
            <div className=" my-2 flex flex-column justify-center h-20">
                <BsFillCheckCircleFill size='35px' color='green' />

            </div>
        </section>
    )
}