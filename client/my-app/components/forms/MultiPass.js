import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, CREATE_USER } from '../../utilities/graphql/mutations'
import Button from '../Button';
import auth from '../../utilities/auth';
import client from '../../utilities/apollo/client.config';

function initial(form) {
    if (form === 'signUp') {
        return { username: null, email: null, password: null }
    } else if (form === 'login') {
        return { email: null, password: null }
    }
}
export function MultiPass({ form }) {
    const [isMounted, setMounted] = useState(false);
    const [locationState, setLocation] = useState(false);
    const initialState = initial(form);
    const [formState, setFormState] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState(false);
    const [login] = useMutation(LOGIN_USER);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false)
    }, [])



    if (!isMounted) return null
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };
    function getLocation() {
        if (!navigator.geolocation) {
            return console.log('Geolocation is not supported by your browser');
        } else {
            return navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const locationData = {
                    latitude: latitude,
                    longitude: longitude
                }
                return setLocation({ ...locationData })
            }, (e) => {
                return console.log('Unable to retrieve location', e);
            })
        }
    }
    const handleFormSubmit = async event => {
        event.preventDefault();

        // ask user for location;
        getLocation()
        // check args
        const args = { ...formState, ...locationState };
        if (form === 'signUp') {
            if (args.username !== null && args.email !== null && args.password !== null) {
                const { data, errors } = await client.mutate({ mutation: CREATE_USER, variables: { ...args } });
                if (errors) {
                    console.log("MUTATIONS ERROR", errors);
                    setErrorMessage();
                }
                if (data) {
                    const token = data.addUser.token;
                    auth.login(token)
                }
            }
        } else if (form === 'login') {
            if (args.email !== null && args.password !== null) {
                try {
                    const { data, errors } = await login({
                        variables: { ...args }
                    });
                    const userData = await { ...data };
                    if (errors) {
                        console.log("MUTATIONS ERROR", errors);
                        setErrorMessage(errors);
                    }
                    // if we have a successful login
                    if (userData) {
                        const data = userData;
                        // destructure the token
                        const { login } = await data;
                        const { token } = await login;
                        // handle with JWT
                        auth.login(token)
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };

    return (
        <form className='w-auto h-auto bg-gray-400 p-4 self-center'>
            <div className='text-center text-white flex flex-row'>
                <p>{errorMessage && errorMessage}</p>
            </div>

            {form === 'signUp' &&
                <>
                    <label className='block  mt-2'>
                        Enter a Username:
                    </label>
                    <input
                        type='text'
                        className=' my-1 text-black'
                        onChange={handleChange}
                        placeholder='Usernames must be unique'
                        name='username'
                        id="username"
                    />
                </>
            }

            <label className='block  mt-2'>
                Email:
            </label>

            <input
                type='text'
                className=' my-1 text-black'
                placeholder="your_email@email.com"
                name="email"
                id="email"
                onChange={handleChange}
            />

            <label className='block mt-2'>
                Password:
            </label>
            <input
                type='password'
                className=' my-1 text-black'
                placeholder="********"
                name="password"
                id="password"
                onChange={handleChange}
            />

            <div className='mt-4 flex justify-center'>
                <Button
                    color={{ color: 'green-500', hover: 'green-700' }}
                    radius={'rounded-md'}
                    class='text-white text-center p-2'
                    action={{ onClick: handleFormSubmit }}
                >
                    {form === 'signUp' ? 'Create Account' : 'Login'}
                </Button>
            </div>
        </form>
    );
}