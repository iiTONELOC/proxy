import Button from "../Button/Button";
import { useEffect, useState } from "react";
import { characterCountColor, validateMessage } from "../../lib/utils";

export default function MessageEditor({ messageId, text, closeEditor, thisSocket }) {
    const [value, setText] = useState(text);
    const [mounted, setMounted] = useState(false);
    const [characterCount, setCharacterCount] = useState(value.length);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, []);

    if (mounted === false) return null
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

    async function handleFormSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        if (characterCount > 0) {
            const cantSend = validateMessage(value)
            if (!cantSend) {
                thisSocket.emit('editMessage', { value, messageId });
                setText('');
                setCharacterCount(0);
                closeEditor()
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
                        Edit
                    </Button>
                    {/* FIXME: ADD CLOSE BUTTON */}
                </div>
            </form>
        </section>
    );
};