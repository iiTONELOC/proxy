import { useEffect } from 'react';
import { MultiPass } from '../../components/forms/MultiPass';
import { loggedIn } from '../../components/Providers/Auth';
import ResponsiveLayout from '../../components/responsive-layout/Responsive';

export default function SignUp() {
    useEffect(() => {
        const signedIn = loggedIn();
        if (signedIn) window.location.replace('/playground')
    }, [])

    return (

        <ResponsiveLayout viewData={{ SignUp: { Element: MultiPass, props: 'signUp' }, display: 'single' }} />
    )
}