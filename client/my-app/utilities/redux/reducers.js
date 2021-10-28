import {
    _REDUX_SET_USER_DATA,
    _REDUX_UPDATE_USERS_IN_RANGE,
    _REDUX_SET_CHAT,
    _REDUX_SET_FR,
    _REDUX_SET_MODAL
} from './actions';
const initialState = {
    me: {},
    usersInRange: [],
    socket: false,
    currentChat: null,
    modal: false,
    modalView: null,
    incomingFriendRequests: []
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
                    me: { ...state.me, ...action.me },
                    usersInRange: action.me.usersInRange.length > 0 ? [...action.me.usersInRange] : [],
                    socket: action.me.socket,
                    incomingFriendRequests: action.me.incomingRequests.length > 0 ? [...action.me.incomingRequests] : [],
                }
            case _REDUX_UPDATE_USERS_IN_RANGE:
                let d = action.usersInRange.inRange.usersInRange
                return {
                    ...state,
                    usersInRange: d.length > 0 ? [...d] : [],
                }
            case _REDUX_SET_CHAT:
                return {
                    ...state,
                    currentChat: action.currentChat,
                }
            case _REDUX_SET_MODAL:
                return {
                    ...state,
                    modal: !state.modal,
                    modalView: action.modalView === 'null' ? initialState.modalView : action.modalView
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