import { _REDUX_SET_CHAT, _REDUX_SET_USER_DATA, _REDUX_UPDATE_USERS_IN_RANGE } from "./actions"

export function setUsersInfo({ data, dispatch }) {
    dispatch({
        type: _REDUX_SET_USER_DATA,
        me: data
    });
};
export function SetUsersInRage({ data, dispatch }) {
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