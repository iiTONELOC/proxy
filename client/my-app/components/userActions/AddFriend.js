import { RiUserAddFill } from 'react-icons/ri';
import Button from '../Button';
export default function AddFriend(props) {
    function handleAddFriend(e) {
        e.preventDefault();;
        alert('Add friend');
    }
    return (
        <Button
            color={{ color: 'gray-700', hover: 'green-700' }}
            radius={'rounded-md'}
            class='text-white text-center p-2'
            action={{ onClick: handleAddFriend }}
        >
            <RiUserAddFill />
        </Button>
    )
}