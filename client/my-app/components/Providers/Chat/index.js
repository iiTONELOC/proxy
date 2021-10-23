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
import { setUsersInfo } from "../../../utilities/redux/helpers";
const SocketContext = createContext();
const { Provider } = SocketContext;



export const ChatProvider = ({ ...props }) => {
    const [mounted, setMounted] = useState(false);
    const [socket, setSocket] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        setMounted(true)
        if (mounted) {
            const nS = io(`http://${window.location.hostname}:3001`);
            const newSocket = nS;
            setSocket(newSocket);


            // `GLOBAL` callbacks if you will
            //  like updating a friends list
            // or notifications can be put here and then added to our Redux
            // component or page specific socket actions should be handled on the page/component

            // WILL NEED LISTENERS FOR
            // LOGIN/LOGOUT
            // updating usersInRange
            // updating FriendsLists
            // friend requests
            // missed Messages


        }
    }, [mounted])

    useEffect(() => {
        if (socket) {
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
                    data: socketData
                }
                socket.emit(_socket_user_login, payload);
                console.log('requesting login..')
            }
            /*CALLBACKS FOR GLOBAL SOCKET ACTIONS */
            // after a successful connection to the chatServer
            // we need to set our user and socket
            socket.on(_authenticated, (data) => { setUsersInfo({ data, dispatch }), console.log(`AUTHENTICATED`, data) })
        }
    }, [socket])
    if (!mounted) return null


    return (
        socket ? <Provider value={socket} {...props} /> : null
    );
};
export const useSocketContext = () => {
    return useContext(SocketContext);
};

export default ChatProvider