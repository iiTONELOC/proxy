import { useState } from 'react';
import { useMutation } from '@apollo/client';
import OnlyOnClient from '../Providers/Client';
import { LOGIN_USER } from '../../utilities/graphql/mutations'
export function MultiPass({ form }) {
    const initialState = () => {
        if (form === 'signUp') {
            return { username: '', email: '', password: '' }
        } else {
            return { email: '', password: '' }
        }
    }
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
        'Coming soon'
    );
}