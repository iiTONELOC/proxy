import MessageContainer from "./MessageContainer";
import MessageForm from "./MessageForm";


export default function Messaging() {
    return (

        <div className="flex flex-col h-full bg-gray-700">
            <div className="h-5/6">
                <MessageContainer />
            </div>
            <div className="h-1/6 p-2">
                <MessageForm />
            </div>
        </div>


    )
}