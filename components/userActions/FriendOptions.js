import { CgOptions } from 'react-icons/cg'
import ButtonWithToolTip from '../Button/ButtonWithToolTip';
import { useDispatch } from 'react-redux';
import { _REDUX_SET_MODAL } from '../../lib/redux/actions';

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
            toolTip: {
                classNames: 'mt-8  p-2 bg-green-900 border-2 border-black drop-shadow-lg',
            },
        },
        action: (e, dispatch, data,) => {
            e.preventDefault();
            dispatch({
                type: _REDUX_SET_MODAL,
                modalView: { view: 'friendsListOptions', data: data }
            });
        }
    },
];





export default function FriendListOptions({ user, userItemHoverHandler }) {
    const dispatch = useDispatch();
    return (
        <div className='p-1 flex justify-end'>
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
