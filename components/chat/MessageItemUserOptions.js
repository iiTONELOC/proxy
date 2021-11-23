import ButtonWithToolTip from '../Button/ButtonWithToolTip';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const iconSize = '20px';
const iconColor = 'text-gray-400';
export default function MessageOptionsUser({ message_id, editHandler }) {
    const messageOptions = [
        {
            toolTip: 'Edit',
            Icon: FiEdit,
            iconSize: iconSize,
            action: () => {
                editHandler();
            },
            settings: {
                button: {
                    color: 'gray-700',
                    hover: 'yellow-500'
                },
                icon: {
                    color: iconColor
                },
                toolTip: {
                    classNames: 'mt-14 text-medium p-2 bg-yellow-500 border-2 border-black drop-shadow-lg',
                },
            },
        },
        {
            toolTip: 'Delete',
            Icon: FiTrash2,
            iconSize: iconSize,
            action: 'handleRemove',
            settings: {
                button: {
                    color: 'gray-700',
                    hover: 'red-700'
                },
                icon: {
                    color: iconColor
                },
                toolTip: {
                    classNames: 'mt-14 text-medium p-2 bg-red-700 border-2 border-black drop-shadow-lg',
                },
            },
        },
    ];
    return (
        <span className='w-full h-full flex flex-row justify-end gap-2'>
            {messageOptions.map(option => (
                <span key={option.toolTip + `${message_id}`}>
                    <ButtonWithToolTip
                        {...option}
                    />
                </span>
            ))}
        </span>
    );
};