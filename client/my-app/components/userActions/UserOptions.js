// import { RiUserAddFill } from 'react-icons/ri';

import { CgOptions } from 'react-icons/cg'
import Button from '../Button';
import { useDispatch } from 'react-redux';

export default function UserOptions(props) {
    const dispatch = useDispatch();
    function toggleModal(e) {
        console.log(`Toggle Modal click`)
        e.preventDefault();
        dispatch({
            type: 'toggle modal',
            modalView: { view: 'usersInRangeOptions', data: props }
        });
    }

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
    )
}

