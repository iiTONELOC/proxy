import { MdAccountBox } from 'react-icons/md';
import { useState } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
export default function UsersInRangeOptionsModal(props) {
    const [hover, setHover] = useState(false);
    const [active, setActive] = useState(false);
    function hoverHandler(e) {
        setHover(!hover);
    }
    function activeHandler(e) {
        setActive(!active);
    }

    const { username, _id, socket, status, location } = props
    return (
        <section className=' text-white p-2' style={{ height: '170x' }}>
            <div className="modal-header">
                <h3 className="text-center text-xl">{username}</h3>
            </div>
            <div className=" my-2 flex flex-row justify-around h-20">
                <div className="flex flex-col items-center w-2/6">
                    <MdAccountBox
                        onMouseEnter={hoverHandler}
                        onMouseLeave={hoverHandler}
                        size='35px' />
                    {hover === true && <span className={`text-sm text-center bg-black rounded-lg p-1  `}>View Profile</span>}
                </div>
                <div className="flex flex-col items-center w-2/6">
                    <AiOutlineUserAdd
                        onMouseEnter={activeHandler}
                        onMouseLeave={activeHandler}
                        size='35px' />
                    {active === true && <span className="text-sm text-center bg-black rounded-lg p-1 ">Add Friend</span>}
                </div>

            </div>

        </section>

    )
}