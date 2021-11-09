import {
    _REDUX_SET_NOTIFICATION_LIST_VISIBILITY,
    _REDUX_UPDATE_USERS_IN_RANGE,
    _REDUX_UPDATE_FRIENDS_LIST,
    _REDUX_SET_USER_DATA,
    _REDUX_SET_RANGE,
    _REDUX_SET_TOAST,
    _REDUX_SET_MODAL,
    _REDUX_SET_CHAT,
    _REDUX_SET_FR,
} from './actions';
const initialState = {
    me: null,
    usersInRange: [],
    socket: false,
    currentChat: null,
    modal: false,
    modalView: null,
    incomingFriendRequests: [],
    toast: null,
    notificationList: false,
    friendsList: [],
    filterRange: 5,
}
export const reducers = (state = initialState, action) => {
    if (typeof window === Object || typeof window === 'object') {
        switch (action?.type) {
            // currently used on login
            // this is for testing will 
            // refactor the cases later
            // currently sets the entire user object in state


            case _REDUX_SET_USER_DATA:
                return {
                    ...state,
                    me: action.me,
                }
            case _REDUX_UPDATE_USERS_IN_RANGE:
                let d = action.usersInRange
                return {
                    ...state,
                    usersInRange: d.length > 0 ? [...d] : []
                }
            case _REDUX_SET_CHAT:
                return {
                    ...state,
                    currentChat: action.currentChat,
                }
            case _REDUX_SET_MODAL:
                console.log(`SETTING MODAL`, action)
                return {
                    ...state,
                    modal: action.toggle === 'false' ? true : !state.modal,
                    modalView: action.modalView === 'null' ? initialState.modalView : action.modalView
                }
            case _REDUX_SET_FR:
                return {
                    ...state,
                    incomingFriendRequests: action.incomingRequests.length > 0 ? [action.incomingRequests] : initialState.incomingFriendRequests,
                }
            case _REDUX_SET_TOAST:
                return {
                    ...state,
                    toast: action.clear ? initialState.toast : { message: action.toast.message, type: action.toast.type }
                }
            case _REDUX_SET_NOTIFICATION_LIST_VISIBILITY:
                return {
                    ...state,
                    notificationList: action.toggle
                }
            case _REDUX_UPDATE_FRIENDS_LIST:
                return {
                    ...state,
                    friendsList: action.friends.length > 0 ? [...action.friends] : []
                }
            case _REDUX_SET_RANGE:
                return {
                    ...state,
                    filterRange: action.range
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