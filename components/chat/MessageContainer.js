import { SCROLL } from ".";
import MessageItem from "./MessageItem";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


export function saveMessage(message, setMessage) {
    setMessage((prevMessages) => {
        const newMessages = { ...prevMessages };
        newMessages[message._id] = message;
        return newMessages
    });
}

export default function MessageContainer({ socket, chatName, globalMessages }) {
    const [mounted, setMounted] = useState(false);
    const [messages, setMessage] = useState([]);

    const state = useSelector(state => state)
    const { me } = state;

    useEffect(() => {
        setMounted(true);
        return () => { setMounted(false); }
    }, []);
    useEffect(() => {
        if (mounted === true) {
            if (globalMessages) {
                globalMessages.globalMessages.forEach(message => {
                    saveMessage(message, setMessage);
                });
            }
            SCROLL();
        }
    }, [mounted]);
    useEffect(() => {
        if (socket) {
            socket.on('incomingChatMessage', (message) => {
                saveMessage(message, setMessage);
                SCROLL();
            });
        }
    }, [socket]);
    if (mounted === false || socket === null) return null

    return (
        <div className="container flex flex-col justify-start p-2  h-full">
            <div className="mt-3 ">
                <h1 className="text-center text-gray-200 font font-medium text-3xl font">
                    {chatName}
                </h1>
            </div>
            <div className=" h-full mt-3 text-gray-300 p-2 overflow-y-auto">
                {me && [...Object.values(messages)].map((message,) => (
                    <MessageItem message={message} key={message._id} user={message.sender === me.username ? true : null} />
                ))}

                <div style={{ minHeight: '10px' }} id='messageContainerEnd'></div>
            </div>
        </div>
    );
};
