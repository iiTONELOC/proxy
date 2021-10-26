import { useEffect, useState } from "react";
import { FaUserSecret } from 'react-icons/fa'
import { SCROLL } from ".";
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
    useEffect(() => {
        setMounted(true);
        SCROLL()
        return () => { setMounted(false) }
    }, []);
    useEffect(() => {
        if (mounted === true) {
            if (globalMessages) {
                globalMessages.globalMessages.forEach(message => {
                    saveMessage(message, setMessage);
                });
            }
            SCROLL()
        }
    }, [mounted])
    useEffect(() => {
        if (socket) {
            socket.on('incomingChatMessage', (message) => {
                saveMessage(message, setMessage);
                SCROLL()
            });
        }
    }, [socket])
    if (mounted === false || socket === null) return null


    return (

        <div className="container flex flex-col justify-start p-2  h-full">
            <div className="mt-3 ">
                <h1 className="text-center text-gray-200 font font-medium text-3xl font">
                    {chatName}
                </h1>
            </div>
            <div className=" h-full mt-3 text-gray-300 p-2 overflow-y-auto">
                {[...Object.values(messages)].map((message, idx) => (
                    <section key={message._id} className='w-full h-auto mb-2 bg-indigo-500 p-2 flex flex-row items-center justify-items-start'>
                        <span className='bg-gray-800' >
                            <FaUserSecret size='35px' />
                        </span>
                        <div className='ml-3 flex flex-col'>
                            <p className='text-sm text-gray-400'> {new Date(parseFloat(message.time)).toLocaleTimeString()}</p>
                            <p className='text-md ml-1'> {message.text}</p>
                        </div>
                    </section>
                ))}

                <div style={{ minHeight: '10px', background: 'black' }} id='messageContainerEnd'></div>
            </div>
        </div>
    )
}