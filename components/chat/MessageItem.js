import Avatar from "../userAvatar/Avatar";
import { useEffect, useState } from "react";
import { hoverHandler } from "../navigation/NavLink";
import { formatTime_hh_mm_ss } from "../../lib/utils";
import MessageOptionsUser from "./MessageItemUserOptions";
import MessageEditor from "./MessageEditor";
import { handleSocketConnection, useSocketContext } from "../Providers/Socket";
/* 
FIXME: 
Render Messages from local state
add socket.io listener to update the message if edited
listener should be editMessage-message_id
listener is for both user and non-user messages
*/
export default function MessageItem({ message, user, picture }) {
    const [mounted, setMounted] = useState(false);
    const [hover, setHover] = useState(false);
    const [edit, setEdit] = useState(false);
    const [thisSocket, setThisSocket] = useState(null);
    const [messageText, setMessageText] = useState(message.text);
    const socket = useSocketContext();

    function onHover() {
        return hoverHandler({ hover, setHover });
    };
    function handleEdit() {
        return setEdit(!edit);
    };
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    useEffect(() => {
        if (mounted) {
            handleSocketConnection(setThisSocket, thisSocket, socket);
        };
    }, [mounted])
    useEffect(() => {
        if (mounted && thisSocket) {
            thisSocket.on(`updateMessage-${message._id}`, (message) => {
                setMessageText(message.text);
            })
        };
    }, [thisSocket]);
    if (!mounted) return null;

    return (
        <article
            onMouseEnter={onHover}
            onMouseLeave={onHover}
            className={`w-full h-auto mb-2 p-2 flex flex-row items-center ${!user ? 'justify-items-start' : 'justify-items-end'} ${hover ? 'bg-gray bg-gray-600' : ''}`}>
            {!user ?
                <>
                    <Avatar size={'35px'} profilePicture={picture ? picture : null} />
                    <div className='ml-3 flex flex-col w-10/12'>
                        <p className='text-sm text-gray-400'> {formatTime_hh_mm_ss(message.time)}</p>
                        <p className='text-md ml-1'> {messageText}</p>
                    </div>
                </> :
                !edit ? <>
                    <div className='flex flex-col  h-full self-start'>
                        {hover && <MessageOptionsUser message_id={message._id} editHandler={() => { handleEdit(setEdit) }} />}
                    </div>
                    <div className='mr-3 flex flex-col w-full text-right'>
                        <p className='text-sm text-gray-400'> {formatTime_hh_mm_ss(message.time)}</p>
                        <p className='text-md ml-1'> {messageText}</p>
                    </div>
                    <Avatar profilePicture={picture ? picture : null} size={'35px'} />  </> :
                    <MessageEditor
                        messageId={message._id}
                        text={messageText}
                        closeEditor={() => handleEdit()}
                        thisSocket={thisSocket}
                    />
            }
        </article>
    );
};