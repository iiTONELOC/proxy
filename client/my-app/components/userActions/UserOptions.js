import { CgOptions } from 'react-icons/cg'
import Button from '../Button';
import { useDispatch } from 'react-redux';
import { _REDUX_SET_MODAL } from '../../utilities/redux/actions';
export default function UserOptions(props) {
    const dispatch = useDispatch();
    function toggleModal(e) {

        e.preventDefault();
        dispatch({
            type: _REDUX_SET_MODAL,
            modalView: { view: 'usersInRangeOptions', data: props }
        });
    };

    return (
        <>
            <Button
                color={{ color: 'gray-700', hover: 'green-700' }}
                radius={'rounded-md'}
                class='text-white text-center p-2'
                action={{ onClick: toggleModal }}
            >
                <CgOptions />
            </Button>
        </>
    );
};

