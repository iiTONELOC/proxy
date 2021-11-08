import { io } from "socket.io-client";
import { useDispatch } from 'react-redux';
import auth from "../../../utilities/auth";
import { actions, reactions } from "../../../lib/chat/actions";
import { makeToast, reduxUpdateIncomingFriendRequests, } from "../../../utilities/redux/helpers";
import { _REDUX_SET_FR, _REDUX_SET_TOAST } from "../../../utilities/redux/actions";
import { getMyFriendsList, getUsersInRange } from "../../../utilities/graphql/userAPI";
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";


const SocketContext = createContext();
const { Provider } = SocketContext;


export const ChatProvider = ({ ...props }) => {
    const [mounted, setMounted] = useState(false);
    const [socket, setSocket] = useState(null);
    const [joined, setJoined] = useState(false);
    const [loggedIn, setLoggedIn] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        setMounted(true);
        const nS = io(`http://${window.location.hostname}:3000`);
        const newSocket = nS;
        setSocket(newSocket);
        return () => { setMounted(false); setLoggedIn(false); setJoined(false) }
    }, []);
    useEffect(() => {
        const isLoggedIn = auth.loggedIn();
        if (isLoggedIn) {
            const loggedInData = auth.getProfile()
            if (loggedInData && !loggedIn) {
                setLoggedIn(loggedInData);
            }
        } else {
            setLoggedIn(null)
        }
    }, [loggedIn]);
    useEffect(() => {
        if (socket && mounted && loggedIn) {
            const { _authenticated } = reactions;
            const { _socket_user_login } = actions;
            const { _id, username } = loggedIn.data;
            const socketData = {
                user: username,
                id: _id
            };
            const payload = {
                request: _socket_user_login,
                data: socketData,
                emitUpdate: joined === true ? false : true
            };
            if (joined !== true) {
                socket.emit(_socket_user_login, payload);
            };
            socket.on(_authenticated, (data) => {
                setJoined(true);
            });
            socket.on('newFriendRequest', (data) => {
                reduxUpdateIncomingFriendRequests({ data: [data], dispatch })
                makeToast({
                    bread: {
                        type: 'info',
                        notification: 'New Friend Request!!',
                        message: `${data.from.username} sent you a friend request!`,
                        crumbs: data.from
                    },
                    dispatch
                });
            });
            socket.on('Request Accepted', (data) => {
                makeToast({
                    bread: {
                        type: 'success',
                        notification: 'Request Accepted!!',
                        message: `${data.username} accepted your friend request!`,
                        crumbs: data
                    },
                    dispatch
                });
                getMyFriendsList(dispatch);
            });
            socket.on('Request Rejected', (data) => {
                makeToast({
                    bread: {
                        type: 'danger',
                        notification: 'Friend Request Not Accepted!!',
                        message: `${data} did not accept your friend request!`,
                    },
                    dispatch
                });
            });
            socket.on('Removed', (data) => {
                makeToast({
                    bread: {
                        type: 'danger',
                        notification: 'Removed from friends list!!',
                        message: `${data.username} removed you as a friend!`,
                    },
                    dispatch
                });
                getMyFriendsList(dispatch);
            });
            socket.on('updateUsersInRange', async () => {
                await getUsersInRange(dispatch);
            });
            socket.on('updateFriendsList', async () => {
                await getMyFriendsList(dispatch);
            });
        };
        return () => setJoined(false);
    }, [socket, loggedIn]);
    if (!mounted) return null;


    return (
        socket ? <Provider value={socket} {...props} /> : null
    );
};

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export function handleSocketConnection(setThisSocket, thisSocket, socket) {
    if (socket.connected === true && !thisSocket) {
        return setThisSocket(socket);
    } else if (thisSocket) {
        return
    }
    else if (socket.connected === false) {
        setTimeout(() => {
            handleSocketConnection(setThisSocket, thisSocket, socket);
        }, 550);
    };
};

export default ChatProvider