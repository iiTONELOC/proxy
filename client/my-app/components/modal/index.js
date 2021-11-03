import { useSelector, useDispatch } from 'react-redux';
import UsersInRangeOptionsModal from './usersInRangeOptions';
import { AiOutlineClose } from 'react-icons/ai';
import Button from '../Button/Button';
import { _REDUX_SET_MODAL } from '../../utilities/redux/actions';
import SuccessModal from './success';

export function Modal() {
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    const { modalView } = state;
    function toggleModal(e) {
        e.preventDefault();
        dispatch({
            type: _REDUX_SET_MODAL,
        });
    }

    function handleModalView(view) {

        switch (view.view) {
            case 'usersInRangeOptions':
                return <UsersInRangeOptionsModal {...modalView.data} />;
            case 'success':
                return <SuccessModal timeout={modalView.data} />;
            default:
                break;
        }
    }

    return (
        <section
            className='bg-gray-900 bg-opacity-80 z-40 w-full h-full absolute flex flex-row justify-center items-center'
            onDoubleClick={toggleModal}
        >
            <div className="w-2/6 bg-gray-600 h-auto rounded-lg p-2 z-50">
                <header className='flex justify-end'>
                    <span onClick={toggleModal}>
                        <Button className="mr-2 p-2" color={{ color: 'gray-600', hover: 'green-700' }} >
                            <AiOutlineClose size='25px' color='white' />
                        </Button></span>
                </header>
                {/* wrapper insert desired modal here */}
                {handleModalView(modalView)}
            </div>
        </section>
    )
}
