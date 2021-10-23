import {
    _REDUX_SET_USER_DATA,
    _REDUX_UPDATE_USERS_IN_RANGE
} from './actions';
const initialState = {
    me: {},
    usersInRange: [],
}
export const reducers = (state = initialState, action) => {
    if (typeof window === Object || typeof window === 'object') {
        switch (action.type) {
            // currently used on login
            // this is for testing will 
            // refactor the cases later
            // currently sets the entire user object in state
            case _REDUX_SET_USER_DATA:
                return {
                    ...state,
                    me: { ...state.me, ...action.me }
                }

            default:
                // console.log(`unknown reducer fired`, { state, action })
                return state;
        }
    } else {
        return null
    }

};

export default reducers;