import {
    _REDUX_SET_CHAT,
    _REDUX_SET_TOAST,
    _REDUX_SET_USER_DATA,
    _REDUX_UPDATE_USERS_IN_RANGE,
    _REDUX_UPDATE_FRIENDS_LIST,
    _REDUX_SET_SOCKET,
    _REDUX_SET_FR,

} from "./actions"

export function reduxSetSocket({ socketData, dispatch }) {
    console.log(`helper`, socketData)
    dispatch({
        type: _REDUX_SET_SOCKET,
        socket: { ...socketData }
    })
};

export function reduxSetMe({ me, dispatch }) {
    dispatch({
        type: _REDUX_SET_USER_DATA,
        me: me
    });
};
export function reduxSetUsersInRange({ data, dispatch }) {
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
export function reduxUpdateIncomingFriendRequests({ data, dispatch }) {
    dispatch({
        type: _REDUX_SET_FR,
        incomingRequests: data
    })
};
export function reduxSetMyFriends({ data, dispatch }) {
    dispatch({
        type: _REDUX_UPDATE_FRIENDS_LIST,
        friends: data
    })
};
// export function reduxUpdateUserData({ userData, dispatch }) {

//     reduxSetUsersInRange({ data: userData.usersInRange, dispatch });
//     reduxUpdateIncomingFriendRequests({ data: userData.incomingRequests, dispatch });
// };