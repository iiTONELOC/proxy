import {
    _REDUX_SET_USER_DATA,
    _REDUX_UPDATE_USERS_IN_RANGE
} from './actions';
const initialState = {
    me: [],
    usersInRange: [],
}
export const reducers = (state = initialState, action) => {
    switch (action.type) {
        case _REDUX_SET_USER_DATA:
            console.log(`REDUX REDUCER FIRED`, { state, action })
            return {
                ...state,
                me: [...action.me]
            }

        default:
            console.log(`unknown reducer fired`, { state, action })
            return state;
    }
};

export default reducers;