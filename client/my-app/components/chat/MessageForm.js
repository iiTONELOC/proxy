import Button from "../Button";

export default function MessageForm() {
    return (
        <section className="w-full h-full">
            <div className="tracking-wider p-1 h-1/6">
                <p style={{ margin: "-3px" }} className="pl-1">0/200</p>
            </div>
            <div className="flex flex-row justify-between bg-gray-600 h-5/6">
                <div className="flex p-1 w-4/5 ">
                    <input type="text" className="bg-gray-500 w-full p-1 h-1/2 self-center rounded-xl">

                    </input>
                </div>
                <div className="flex items-center p-1 w-1/6">
                    <Button
                        color={{ color: 'green-500', hover: 'green-700' }}
                        radius={'rounded-md'}
                        class='text-white text-center p-2 h-1/2 w-full'
                    >
                        Send
                    </Button>
                </div>
                {/* <div className="">

                </div> */}
            </div>
        </section>
    )
}