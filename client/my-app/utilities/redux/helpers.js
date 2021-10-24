import { _REDUX_SET_USER_DATA } from "./actions"

export function setUsersInfo({ data, dispatch }) {
    dispatch({
        type: _REDUX_SET_USER_DATA,
        me: data
    });
}