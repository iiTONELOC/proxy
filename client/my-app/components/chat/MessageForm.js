import Button from "../Button/Button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { useMutation } from "@apollo/client";

export default function MessageForm({ socket }) {
    const _REDUX_S = useSelector((state) => state);
    const [value, setText] = useState('');
    const [mounted, setMounted] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    // const [sendMessage] = useMutation(SEND_MESSAGE);
    // change event handler
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, []);

    if (mounted === false || socket === null) return null
    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };
    // listens for enter keys
    const handleKeyDown = event => {
        if (event.code === 'NumpadEnter' || event.code === "Enter") {
            handleFormSubmit(event)
        }
    }
    // handles form submission
    async function handleFormSubmit(event) {
        event.preventDefault();
        // grab our user data from the auth
        // username
        const userName = _REDUX_S.me.username
        // msg Data obj
        // gets sent to chat server
        const messageData = {
            value: value.trim(),
            username: userName,
            id: Date.now(),
            chat: 'Global',
        }
        if (socket && characterCount > 0) {
            const regEx = /([a - zA - Z0 - 9])$/
            const cantSend = regEx.test(value.trimEnd());
            if (!cantSend) {
                socket.emit('globalChatMessage', messageData);
                setText('');
                setCharacterCount(0);
            }
        }
    };

    // visual waring on message length
    const color = () => {
        const length = characterCount;
        if (length <= 84) return 'green';
        if (length >= 85 && length <= 139) return 'yellow';
        if (length >= 140 && length <= 274) return 'orange'
        if (length >= 275) return 'red'
    }

    return (
        <section className="w-full  flex flex-col">
            <div className="tracking-wider p-1 h-6">
                <p style={{ margin: "-3px", color: color() }} className="pl-1">{characterCount}/200</p>
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
                        color={{ color: 'green-500', hover: 'green-700' }}
                        radius={'rounded-md'}
                        class='text-white text-center p-2 h-14 w-28'
                        onSubmit={(e) => handleFormSubmit(e)}
                    >
                        Send
                    </Button>
                </div>

                {/* <div className="">
                </div> */}
            </form>
        </section>
    );
};