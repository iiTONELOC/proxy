import {
    _REDUX_SET_NOTIFICATION_LIST_VISIBILITY,
    _REDUX_UPDATE_USERS_IN_RANGE,
    _REDUX_UPDATE_FRIENDS_LIST,
    _REDUX_SET_USER_DATA,
    _REDUX_SET_TOAST,
    _REDUX_SET_MODAL,
    _REDUX_SET_CHAT,
    _REDUX_SET_FR,
} from './actions';
const initialState = {
    me: {},
    usersInRange: [],
    socket: false,
    currentChat: null,
    modal: false,
    modalView: null,
    incomingFriendRequests: [],
    toast: null,
    notificationList: false,
    friendsList: null,
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
                    me: { ...state.me, ...action.me },
                    usersInRange: action.me?.usersInRange.length > 0 ? [...action.me.usersInRange] : [],
                    socket: action.me?.socket,
                    incomingFriendRequests: action.me?.incomingRequests.length > 0 ? [...action.me.incomingRequests] : initialState.incomingFriendRequests,
                }
            case _REDUX_UPDATE_USERS_IN_RANGE:
                let d = action.usersInRange
                return {
                    ...state,
                    usersInRange: d.length > 0 ? [...d] : initialState.incomingFriendRequests,
                }
            case _REDUX_SET_CHAT:
                return {
                    ...state,
                    currentChat: action.currentChat,
                }
            case _REDUX_SET_MODAL:
                return {
                    ...state,
                    modal: action.toggle === 'false' ? true : !state.modal,
                    modalView: action.modalView === 'null' ? initialState.modalView : action.modalView
                }
            case _REDUX_SET_FR:

                return {
                    ...state,
                    incomingFriendRequests: action.incomingRequests.length === 0 ? initialState.incomingFriendRequests : [...action.incomingRequests]
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
            default:
                // console.log(`unknown reducer fired`, { state, action })
                return state;
        }
    } else {
        return null
    }

};

export default reducers;