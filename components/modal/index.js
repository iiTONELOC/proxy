import SuccessModal from './success';
import Button from '../Button/Button';
import InRangeFilter from './inRangeFilter';
import { AiOutlineClose } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { calculateHeight } from '../../utilities/utils';
import FriendsListOptionsModal from './friendsListOptions';
import UsersInRangeOptionsModal from './usersInRangeOptions';
import { _REDUX_SET_MODAL } from '../../utilities/redux/actions';




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
            case 'inRangeFilter':
                return <InRangeFilter currentRange={modalView.data} />;
            case 'friendsListOptions':
                return <FriendsListOptionsModal {...modalView.data} />;
            default:
                break;
        }
    }

    return (
        <section
            className={`bg-gray-900 bg-opacity-80 z-40 w-full  absolute flex flex-row justify-center items-center`}
            onDoubleClick={toggleModal}
            style={{ height: calculateHeight() }}
        >
            <div className="bg-gray-600 h-auto rounded-lg p-2 z-50" style={{ width: 365 }}>
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
