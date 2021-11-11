import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import UserItem from '../userItem/UserItem';
import { GiRadarDish } from "react-icons/gi";
import ButtonWithToolTip from '../Button/ButtonWithToolTip';
import { _REDUX_SET_MODAL } from '../../clientUtilities/redux/actions';
import { calculateDistance, getUsersInRange } from '../../clientUtilities/graphql/userAPI';
import Button from '../Button/Button';
export default function UsersInRange() {
    const [mounted, setMounted] = useState(false);
    const state = useSelector((state) => state);
    const [proxies, setProxies] = useState(null);
    const { usersInRange, filterRange } = state;
    const dispatch = useDispatch();

    async function filterUsersByDistance(array) {
        let filteredUsers = [];
        if (array.length > 0) {
            async function getDistance(user) {
                const args = {
                    lat1: user.location.latitude.toString(),
                    lon1: user.location.longitude.toString(),
                }
                return await calculateDistance({ ...args });
            }
            if (mounted && filterRange) {
                for (let i = 0; i < array.length; i++) {
                    const user = array[i];
                    const distance = await getDistance(user);
                    if (distance <= filterRange) {
                        filteredUsers.push(user);
                    }
                };
            }
            return filteredUsers;
        } else {
            return filteredUsers
        }
    };
    async function setUsers(setProxies) {
        if (typeof setProxies === 'function') {
            const users = await filterUsersByDistance(usersInRange);
            setProxies(users);
        }
    };
    useEffect(() => {
        setMounted(true);
        getUsersInRange(dispatch)
        return () => { setMounted(false); setUsers(null) };
    }, []);
    useEffect(() => {
        if (mounted === true) {
            setUsers(setProxies)
        }
    }, [mounted, usersInRange, filterRange]);


    if (mounted == false) return null;
    function handleFilter(e) {
        e.preventDefault();
        dispatch({
            type: _REDUX_SET_MODAL,
            modalView: { view: 'inRangeFilter', data: filterRange }
        });
    };
    return (
        <div className=' static bg-gray-800 rounded p-2 flex mt  flex-col justify-center text-white'>
            <header className='w-full flex flex-row justify-between text-center p-2'>
                <span>
                    <Button
                        color={{ color: 'gray-800', hover: 'gray-700' }}
                        radius={'rounded-md'}
                        class='text-white text-center p-2'
                        action={{ onClick: handleFilter }}
                    >
                        <GiRadarDish color='white' size='35px' />
                    </Button>

                </span>
                <span>
                    <ButtonWithToolTip
                        toolTip='Adjust Range'
                        name={`${filterRange} miles`}
                        iconSize='35px'
                        action='adjust range'
                        settings={{
                            button: {
                                color: 'gray-900',
                                hover: 'green-700',
                                classNames: 'p-2'
                            },
                            icon: {
                                color: 'bg-gray-400'
                            },
                            toolTip: {
                                classNames: 'mt-20 text-medium p-2 bg-green-700 border-2 border-black drop-shadow-lg',
                            },
                        }}
                        action={handleFilter}
                    />
                </span>


            </header>
            <div className='max-h-40 p-1 overflow-x-hidden overflow-y-auto flex flex-col gap-3'>
                {proxies?.length > 0 ? proxies.map(user => (
                    <UserItem key={user._id} user={user} />
                )
                ) : null
                }
            </div>
        </div>
    );
};
