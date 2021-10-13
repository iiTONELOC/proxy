import { io } from "socket.io-client";
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
    const [socket, setSocket] = useState({});
    useEffect(() => {
        setMounted(true)
        if (mounted) {
            const nS = io(`http://${window.location.hostname}:3001`);
            const newSocket = nS;
            // emit we are online
            const socketData = {
                user: 'test',
                id: 1234
            }
            newSocket.emit('connected', socketData);
            console.log('socket connecting...')
            setSocket(newSocket)
        }
    }, [mounted])

    return (
        <Provider value={socket} {...props} />
    );
};
export const useSocketContext = () => {
    return useContext(SocketContext);
};