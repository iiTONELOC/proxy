import { useEffect, useState } from "react"
import { variantIcon } from "../../clientUtilities/utils"

import Button from "../Button/Button"
export default function ConfirmModal({ message, pageButtons }) {
    return (
        <span className='w-full flex flex-col justify-start gap-3 items-center text-gray-300 bg-gray-800 rounded-md p-2'>
            {variantIcon('info', 45)}
            <p>{message}</p>
            <span>
                {pageButtons.map((button, index) => {
                    return (
                        <Button key={button.name} {...button}>
                            {button.name}
                        </Button>
                    )
                })}
            </span>
        </span>
    )
}