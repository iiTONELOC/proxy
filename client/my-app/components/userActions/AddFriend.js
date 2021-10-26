// import { RiUserAddFill } from 'react-icons/ri';
import { CgOptions } from 'react-icons/cg'
import Button from '../Button';
function handleAddFriend(e) {
    e.preventDefault();;
    alert('Add friend');
}
export default function AddFriend(props) {

    // we take the userId from the props
    const { userId } = props;

    return (
        <Button
            color={{ color: 'gray-700', hover: 'green-700' }}
            radius={'rounded-md'}
            class='text-white text-center p-2'
            action={{ onClick: handleAddFriend }}
        >
            <CgOptions />
        </Button>
    )
}