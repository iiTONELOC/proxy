import { SCROLL } from ".";
import MessageItem from "./MessageItem";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { idbPromise } from "../../lib/idb";


export function saveMessage(message, setMessage) {
    setMessage((prevMessages) => {
        const newMessages = { ...prevMessages };
        newMessages[message._id] = message;
        return newMessages
    });
};

export default function MessageContainer({ socket, chatName, globalMessages }) {
    const [mounted, setMounted] = useState(false);
    const [messages, setMessage] = useState([]);
    const state = useSelector(state => state)
    const { me, picture } = state;

    async function setImages(data, setMessage) {
        const images = await idbPromise('friend_images', 'get');
        const matched = images.filter(image => image._id === data.sender);
        if (matched.length > 0) data.picture = matched[0].picture;
        if (data.sender === me.username) data.picture = picture ? picture : me?.profile?.profilePicture;
        saveMessage(data, setMessage);
    };
    async function getMessagesWithImages(data) {
        if (Array.isArray(data)) {
            data.forEach(message => {
                setImages(message, setMessage);
            });
        } else {
            setImages(data, setMessage);
        };
    };

    useEffect(() => {
        setMounted(true);
        return () => { setMounted(false); }
    }, []);
    useEffect(() => {
        if (mounted === true) {
            if (globalMessages.length > 0) {
                getMessagesWithImages(globalMessages);
            }
            SCROLL();
        }
    }, [mounted]);

    useEffect(() => {
        if (socket) {
            socket.on('incomingChatMessage', (message) => {
                getMessagesWithImages(message);
                SCROLL();
            });
            socket.on('deleteMessage', (message) => {
                setMessage((prevMessages) => {
                    const newMessages = { ...prevMessages };
                    delete newMessages[message._id];
                    return newMessages
                });
                SCROLL();
            })
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
                {me && [...Object.values(messages)].map((message) => (
                    <MessageItem
                        message={message}
                        key={message._id}
                        picture={message.picture ? message.picture : null}
                        user={message.sender === me.username ? true : null}
                    />
                ))}
                <div style={{ minHeight: '10px' }} id='messageContainerEnd'></div>
            </div>
        </div>
    );
};
