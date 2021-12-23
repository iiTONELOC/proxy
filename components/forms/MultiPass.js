import Button from '../Button/Button';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import auth from '../../lib/auth';
import client from '../../lib/apollo/client.config';
import { browserGetLocation, validateEmail } from '../../lib/utils';
import { LOGIN_USER, CREATE_USER } from '../../lib/graphql/mutations';



function returnInitial(form) {
    if (form === 'signUp') {
        return { username: null, email: null, password: null };
    } else if (form === 'login') {
        return { email: null, password: null };
    };
};
export function MultiPass({ form }) {
    const [isMounted, setMounted] = useState(false);
    const [locationState, setLocation] = useState(false);
    const initialState = returnInitial(form);
    const [formState, setFormState] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState(false);
    const [formValidationError, setValidationError] = useState({ username: null, email: null, password: null });
    const [login] = useMutation(LOGIN_USER);

    useEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
            setFormState(initialState);
            setValidationError({ username: null, email: null, password: null });
        };
    }, []);
    if (!isMounted) return null
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };
    function clearError() {
        return setTimeout(() => {
            setErrorMessage(false);
        }, 5500);
    };
    const validate = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (form === 'signUp') {
            if (name === 'username') {
                if (value != '' && value.length < 3) {
                    setValidationError({ ...formValidationError, username: 'Usernames must be at least 3 characters long!' });
                } else {
                    setValidationError({ ...formValidationError, username: null });
                };
            } else if (name === 'email') {
                if (value != '' && !validateEmail(value)) {
                    setValidationError({ ...formValidationError, email: 'Please enter a valid email!' });
                } else {
                    setValidationError({ ...formValidationError, email: null });
                };
            } else if (name === 'password') {
                if (value != '' && value.length < 6) {
                    setValidationError({ ...formValidationError, password: 'Passwords must be at least 6 characters long!' });
                } else {
                    setValidationError({ ...formValidationError, password: null });
                };
            };
        };
    };
    const handleFormSubmit = async event => {
        event.preventDefault();
        // ask user for location;
        const locationData = browserGetLocation();
        setLocation({ ...locationData });
        // check args
        const args = { ...formState, ...locationState };
        if (form === 'signUp') {
            if (args.username !== null && args.email !== null && args.password !== null && locationState !== null) {
                try {
                    const { data } = await client.mutate({ mutation: CREATE_USER, variables: { ...args } });
                    if (data) {
                        const token = data.addUser.token;
                        auth.login(token);
                    }
                } catch (e) {
                    setErrorMessage(e.message);
                    clearError();
                };
            };
        } else if (form === 'login') {
            if (args.email !== null && args.password !== null && locationState !== null) {
                try {
                    const { data } = await login({
                        variables: { ...args }
                    });
                    const userData = await { ...data };
                    // if we have a successful login
                    if (userData) {
                        const data = userData;
                        // destructure the token
                        const { login } = await data;
                        const { token } = await login;
                        // handle with JWT
                        auth.login(token);
                    };
                } catch (e) {
                    setErrorMessage(e.message);
                    clearError();
                };
            };
        };
    };

    return (
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <div className={`text-center ${errorMessage ? 'bg-red-500' : null} text-white flex flex-row p-5 rounded-md`}>
                <p>{errorMessage && errorMessage}</p>
            </div>
            {form === 'signUp' ?
                <div
                    className={`
                        text-white flex flex-col p-2 w-full 
                        h-auto justify-center items-center gap-2`}>
                    {
                        formValidationError.email &&
                        <p className='p-3 rounded-md bg-red-600 text-xl'>
                            {formValidationError.email}
                        </p>
                    }
                    {
                        formValidationError.username &&
                        <p className='p-3 rounded-md bg-red-600 text-xl'>
                            {formValidationError.username}
                        </p>
                    }
                    {
                        formValidationError.password &&
                        <p className='p-3 rounded-md bg-red-600 text-xl'>
                            {formValidationError.password}
                        </p>
                    }
                </div> : null
            }
            <form className='w-auto md:w-2/6 h-auto bg-gray-400 p-4 self-center rounded-lg'>
                {form === 'signUp' &&
                    <>
                        <label className='block  mt-2 text-xl'>
                            Enter a Username:
                        </label>
                        <input
                            type='text'
                            className='my-3 text-gray-300 bg-gray-600 w-full p-3 text-lg rounded-md'
                            onChange={handleChange}
                            placeholder='Usernames must be unique'
                            name='username'
                            id="username"
                            onBlur={(e) => validate(e)}
                        />
                    </>
                }
                <label className='block  mt-2 text-xl'>
                    Email:
                </label>
                <input
                    type='text'
                    className='my-3 text-gray-300 bg-gray-600 w-full p-3 text-lg rounded-md'
                    placeholder="your_email@email.com"
                    name="email"
                    id="email"
                    onChange={handleChange}
                    onBlur={(e) => validate(e)}
                />
                <label className='block mt-2 text-xl'>
                    Password:
                </label>
                <input
                    type='password'
                    className='my-3 text-gray-300 bg-gray-600 w-full p-3 text-lg rounded-md'
                    placeholder="********"
                    name="password"
                    id="password"
                    onChange={handleChange}
                    onBlur={(e) => validate(e)}
                />
                <div className='mt-4 flex justify-center'>
                    <Button
                        color={{ color: 'green-600', hover: 'green-500' }}
                        radius={'rounded-md'}
                        class='text-white text-center text-xl p-2'
                        action={{ onClick: handleFormSubmit }}
                    >
                        {form === 'signUp' ? 'Create Account' : 'Login'}
                    </Button>
                </div>
            </form>
        </div>
    );
}