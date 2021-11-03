import { CgOptions } from 'react-icons/cg'
import ButtonWithToolTip from '../Button/ButtonWithToolTip';
import { useDispatch } from 'react-redux';
import { _REDUX_SET_MODAL } from '../../utilities/redux/actions';

const iconSize = '20px';
const iconColor = 'text-gray-400';
const options = [
    {
        toolTip: 'View Options',
        Icon: CgOptions,
        iconSize: iconSize,
        action: 'viewOptions',
        settings: {
            button: {
                color: 'gray-800',
                hover: 'green-500'
            },
            icon: {
                color: iconColor
            },
        },
        action: (e, dispatch, data,) => {
            e.preventDefault();
            dispatch({
                type: _REDUX_SET_MODAL,
                modalView: { view: 'usersInRangeOptions', data: data }
            });
        }
    },
];





export default function UserOptions({ user, userItemHoverHandler }) {
    const dispatch = useDispatch();
    return (
        <div className='p-1 flex justify-between items-center w-full'>
            {
                options.map(option => (
                    <ButtonWithToolTip
                        key={option.toolTip + `${Date.now()}`}
                        dispatch={dispatch}
                        user={user}
                        parentHoverHandler={userItemHoverHandler}
                        {...option}
                    />
                ))
            }
        </div>
    );
};

