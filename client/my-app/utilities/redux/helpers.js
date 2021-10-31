import {
    _REDUX_SET_CHAT,
    _REDUX_SET_TOAST,
    _REDUX_SET_USER_DATA,
    _REDUX_UPDATE_USERS_IN_RANGE,
    _REDUX_SET_SOCKET,
    _REDUX_SET_FR,

} from "./actions"

export function set_ReduxSocket({ socketData, dispatch }) {
    console.log(`helper`, socketData)
    dispatch({
        type: _REDUX_SET_SOCKET,
        socket: { ...socketData }
    })
};

export function setUsersInfo({ userData, dispatch }) {
    dispatch({
        type: _REDUX_SET_USER_DATA,
        me: userData
    });
};
export function SetUsersInRage({ data, dispatch }) {
    console.log(`helper USERS IN RANGE`, data)
    dispatch({
        type: _REDUX_UPDATE_USERS_IN_RANGE,
        usersInRange: data
    });
};
export function setChat({ data, dispatch }) {
    dispatch({
        type: _REDUX_SET_CHAT,
        currentChat: data
    });
};
export function makeToast({ bread, dispatch }) {
    dispatch({
        type: _REDUX_SET_TOAST,
        toast: {
            type: {
                type: bread.type,
                notification: bread.notification
            },
            message: bread.message,
            data: bread.crumbs
        }
    })
};
export function updateIncomingRequests({ data, dispatch }) {
    dispatch({
        type: _REDUX_SET_FR,
        incomingRequests: data
    })
};

export function updateUserData({ userData, dispatch }) {
    SetUsersInRage({ data: userData.usersInRange, dispatch });
    updateIncomingRequests({ data: userData.incomingRequests, dispatch });
};