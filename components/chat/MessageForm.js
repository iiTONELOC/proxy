import Button from "../Button/Button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { characterCountColor, validateMessage } from "../../lib/utils";

export default function MessageForm({ socket }) {
    const _REDUX_S = useSelector((state) => state);
    const [value, setText] = useState('');
    const [mounted, setMounted] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const { me, picture } = _REDUX_S;

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, []);

    if (mounted === false || socket === null) return null
    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharacterCount(event.target.value.length);
        };
    };
    const handleKeyDown = event => {
        if (event.code === 'NumpadEnter' || event.code === "Enter") {
            handleFormSubmit(event);
        };
    };

    async function handleFormSubmit(event,) {
        event.preventDefault();
        const userName = _REDUX_S.me.username
        const messageData = {
            value: value.trim(),
            username: userName,
            profilePic: picture ? picture : me?.profile?.profilePicture,
            id: Date.now(),
            chat: 'Global',
        }
        if (socket && characterCount > 0) {
            const cantSend = validateMessage(value)
            if (!cantSend) {
                socket.emit('globalChatMessage', messageData);
                setText('');
                setCharacterCount(0);
            }
        }
    };
    return (
        <section className="w-full  flex flex-col">
            <div className="tracking-wider p-1 h-6">
                <p style={{ margin: "-3px", color: characterCountColor(characterCount) }} className="pl-1">{characterCount}/200</p>
            </div>
            <form className="flex flex-row justify-between  h-5/6" onSubmit={handleFormSubmit}>
                <div className="flex p-1 w-4/5 text-gray-400">
                    <input
                        type="text"
                        value={value}
                        name="messageInput"
                        placeholder='  Message . . .'
                        onChange={handleChange}
                        onKeyDownCapture={handleKeyDown}
                        className="bg-gray-600 w-full p-1 h-14 self-center rounded-xl"
                    />
                </div>
                <div className="flex items-center justify-end bp-1 w-1/6">
                    <Button
                        color={{ color: 'green-800', hover: 'green-600' }}
                        radius={'rounded-md'}
                        class='text-white text-center p-2 h-14 w-28'
                        onSubmit={(e) => handleFormSubmit(e)}
                    >
                        Send
                    </Button>
                </div>
            </form>
        </section>
    );
};