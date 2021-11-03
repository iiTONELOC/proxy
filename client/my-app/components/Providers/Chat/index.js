import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { io } from "socket.io-client";
import auth from "../../../utilities/auth";
import { useDispatch, useSelector } from 'react-redux';
import { actions, reactions } from "../../../../../server/chat/actions";
import { makeToast, reduxUpdateIncomingFriendRequests, } from "../../../utilities/redux/helpers";
import { _REDUX_SET_FR, _REDUX_SET_TOAST } from "../../../utilities/redux/actions";
import { getMyFriendsList, getUsersInRange } from "../../../utilities/graphql/userAPI";



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
        const nS = io(`http://${window.location.hostname}:3001`);
        const newSocket = nS;
        setSocket(newSocket);
        console.log('Socket connection establishing...');
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
            // grab our data and package it for ChatServer
            const { _id, username } = loggedIn.data;
            const socketData = {
                user: username,
                id: _id
            };
            console.log('socket connecting...');
            const payload = {
                request: _socket_user_login,
                data: socketData,
                emitUpdate: joined === true ? false : true
            };
            if (joined !== true) {
                socket.emit(_socket_user_login, payload);
                console.log('requesting login..');
            };
            /*CALLBACKS FOR GLOBAL SOCKET ACTIONS */
            // after a successful connection to the chatServer
            // we need to set our user and socket
            socket.on(_authenticated, (data) => {
                console.log('...Socket is Authorized');
                // grab our friends list data and set it in redux

                setJoined(true);
            });
            socket.on('newFriendRequest', (data) => {
                reduxUpdateIncomingFriendRequests({ data: [data], dispatch })
                makeToast({
                    bread: {
                        type: 'info',
                        notification: 'New Friend Request',
                        message: `${data.from.username} sent you a friend request!`,
                        crumbs: data.from
                    },
                    dispatch
                })
            });
            socket.on('Request Accepted', (data) => {
                console.log('Request accepted', data);
                makeToast({
                    bread: {
                        type: 'success',
                        notification: 'Request Accepted',
                        message: `${data.username} accepted your friend request!`,
                        crumbs: data
                    },
                    dispatch
                });
                getMyFriendsList(dispatch)
                // need to update our data if we think that is needed
            });
            socket.on('updateUsersInRange', async () => {
                console.log(`UPDATING USERS IN RANGE`)
                await getUsersInRange(dispatch)
                // await getFriendRequests(dispatch)
            });
            socket.on('updateFriendsList', async () => {
                console.log(`NOTICE TO UPDATE FRIENDS LIST`)
                await getMyFriendsList(dispatch)
                // await getFriendRequests(dispatch)
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