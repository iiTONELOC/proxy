import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utilities/graphql/mutations'
import Button from '../Button';

function initial(form) {
    if (form === 'signUp') {
        return { username: '', email: '', password: '' }
    } else {
        return { email: '', password: '' }
    }
}
export function MultiPass({ form }) {
    const initialState = initial(form);
    const [formState, setFormState] = useState(initialState);
    const [login, { error }] = useMutation(LOGIN_USER);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleFormSubmit = async event => {
        event.preventDefault();
        try {
            const { data } = await login({
                variables: { ...formState }
            });
            const userData = await { ...data };
            // if we have a successful login
            if (userData) {
                const data = userData;
                // destructure the token
                const { login } = await data;
                const { token } = await login;
                // handle with JWT
                Auth.login(token)
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (



        <form className='w-auto h-auto bg-gray-400 p-4 self-center'>
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
                    onSubmit={handleFormSubmit}
                    class='text-white text-center p-2'
                >
                    {form === 'signUp' ? 'Create Account' : 'Login'}
                </Button>
            </div>
        </form>
    );
}