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
import { makeToast, setUsersInfo, SetUsersInRage, updateIncomingRequests } from "../../../utilities/redux/helpers";
import { _REDUX_SET_FR, _REDUX_SET_TOAST } from "../../../utilities/redux/actions";

const SocketContext = createContext();
const { Provider } = SocketContext;



export const ChatProvider = ({ ...props }) => {
    const [mounted, setMounted] = useState(false);
    const [socket, setSocket] = useState(null);
    const [joined, setJoined] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        setMounted(true);
        if (mounted) {
            const nS = io(`http://${window.location.hostname}:3001`);
            const newSocket = nS;
            setSocket(newSocket);
        }
    }, [mounted]);

    useEffect(() => {
        if (socket && mounted === true) {
            const loggedInData = auth.getProfile();
            const { _authenticated } = reactions;
            const { _socket_user_login } = actions;
            if (loggedInData !== undefined || loggedInData !== null) {
                // grab our data and package it for ChatServer
                const { _id, username } = loggedInData ? loggedInData?.data : {};
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
                    setJoined(true);
                };

            };
            /*CALLBACKS FOR GLOBAL SOCKET ACTIONS */
            // after a successful connection to the chatServer
            // we need to set our user and socket
            socket.on(_authenticated, (data) => { console.log('...Socket is Authorized') });
            socket.on('newFriendRequest', (data) => {
                let pl = [data]
                console.log('new friend request', [data]);
                updateIncomingRequests({ data: pl, dispatch })
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
            socket.on('RequestAccepted', (data) => {
                console.log('Request accepted', data);
                makeToast({
                    bread: {
                        type: 'success',
                        notification: 'Request Accepted',
                        message: `${data.username} accepted your friend request!`,
                        crumbs: data
                    },
                    dispatch
                })
                // STILL NEED TO UPDATE RECP's DATA
            })
        };
        return () => setJoined(false);
    }, [socket]);
    if (!mounted) return null;


    return (
        socket ? <Provider value={socket} {...props} /> : null
    );
};
export const useSocketContext = () => {
    return useContext(SocketContext);
};

export default ChatProvider