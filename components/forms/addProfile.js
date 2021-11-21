import Button from "../Button/Button";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { _REDUX_SET_MODAL } from "../../lib/redux/actions";
import { EDIT_PROFILE_BIO } from "../../lib/graphql/mutations";

export function confirmAddProfile({ message, user, dispatch }) {
    // PROMPT USER TO ADD A PROFILE
    // trigger the confirm modal
    // create a message asking if the user wants to add their profile
    // create the buttons here to confirm or cancel, pass to modal
    // if confirmed, trigger addProfile Modal
    const pageButtons = [
        {
            color: { color: 'gray-500', hover: 'green-700' },
            radius: 'rounded-md',
            class: 'text-white text-center p-2 ml-2',
            action: {
                onClick: (e) => { /*WE NEED TO LOAD THE AddProfileModal */
                    dispatch({
                        type: _REDUX_SET_MODAL,
                        toggle: 'false',
                        modalView: {
                            view: 'addProfile',
                            data: {
                                user,
                            },
                        },
                    });
                }
            },
            name: 'Yes'
        },
        {
            color: { color: 'gray-500', hover: 'red-700' },
            radius: 'rounded-md',
            class: `text-white text-center p-2 ml-2`,
            action: {
                onClick: (e) => { /*NEED TO RESET MODAL STATUS AND LOG USER IN HERE*/
                    dispatch({
                        type: _REDUX_SET_MODAL,
                    });
                }
            },
            name: `No`
        },
    ]
    dispatch({
        type: _REDUX_SET_MODAL,
        modalView: {
            view: 'confirm',
            data: {
                user,
                message,
                pageButtons
            },
        },
    });
}

// form needs the image Uploader to be part of it
export default function ProfileForm({ user, parentState }) {
    const [profileFormData, setProfileFormData] = useState({ bio: null, visible: null })
    const [isMounted, setMounted] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [editProfile] = useMutation(EDIT_PROFILE_BIO);

    const dispatch = useDispatch();
    useEffect(() => {
        setMounted(true);

        return () => setMounted(false)
    }, []);
    if (!isMounted) return null
    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfileFormData({
            ...profileFormData,
            [name]: value,
        });
    };
    function clearError() {
        return setTimeout(() => {
            setErrorMessage(false);
        }, 3500);
    };
    const handleFormSubmit = async event => {

        event.preventDefault();
        // ask user for location;
        const { data, error } = await editProfile({
            variables: { ...profileFormData }
        });
        if (error) handleError(error);
        if (data !== null) { parentState(true) }

    };
    function handleError(error) {
        setErrorMessage(error.message);
        clearError();
    }


    return (
        <form className='w-full h-auto p-4 self-center'>
            <div className={`text-center ${errorMessage ? 'bg-red-500' : null} text-white flex flex-row`}>
                <p>{errorMessage && errorMessage}</p>
            </div>

            <label className='block  mt-2'>
                Bio:
            </label>
            <input
                type='text'
                className=' my-3 text-gray-300 bg-gray-600 w-full p-3'
                onChange={handleChange}
                placeholder='Tell us about yourself!'
                name='bio'
                id="bio"
            />



            <div className='mt-4 w-full flex justify-end'>
                <Button
                    color={{ color: 'green-700', hover: 'green-500' }}
                    radius={'rounded-md'}
                    class='text-white text-center p-2'
                    action={{ onClick: handleFormSubmit }}
                >
                    Add Bio
                </Button>
            </div>
        </form>
    )
}

