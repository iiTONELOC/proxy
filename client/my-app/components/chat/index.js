import MessageForm from "./MessageForm";
import { useEffect, useState } from "react";
import MessageContainer from "./MessageContainer";
import { useSocketContext } from "../Providers/Chat";

export default function Messaging() {
    const thisSocket = useSocketContext();
    const [socket, setSocket] = useState(null);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, []);
    useEffect(() => {
        if (mounted === true) {
            if (thisSocket) {
                setSocket(thisSocket)
            }
        }
    }, [mounted]);

    if (mounted === false || socket === null) return null
    return (

        <div className="flex flex-col h-full bg-gray-700">
            <div className="h-5/6">
                <MessageContainer socket={socket} />
            </div>
            <div className="h-1/6 p-2">
                <MessageForm socket={socket} />
            </div>
        </div>


    )
}