import { useEffect } from 'react';
import { MultiPass } from '../../components/forms/signup-login';
import { loggedIn } from '../../components/Providers/Auth';

export default function SignUp() {
    useEffect(() => {
        const signedIn = loggedIn();
        if (signedIn) window.location.replace('/playground')
    }, [])

    return (
        <MultiPass form={'signUp'} />
    )
}