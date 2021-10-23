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

            console.log('socket connecting...');
            const payload = {
                request: 'login',
                data: socketData
            }
            newSocket.emit('user requesting login', payload);
            console.log('requesting login..')
            setSocket(newSocket);
            newSocket.on('logged', (data) => console.log(`authenticated`, data))
        }
    }, [mounted])
    if (!mounted) return null
    return (
        <Provider value={socket} {...props} />
    );
};
export const useSocketContext = () => {
    return useContext(SocketContext);
};