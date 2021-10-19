import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { MultiPass } from '../../components/forms/MultiPass';
import ResponsiveLayout from '../../components/responsive-layout/Responsive';
import auth from '../../utilities/auth';



export default function SignUp() {
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const user = auth.getProfile();
        if (user) {
            setLoggedIn(true);
        };
    }, []);
    if (loggedIn) router.push('/playground');
    return (
        !loggedIn && <ResponsiveLayout viewData={{ SignUp: { Element: MultiPass, props: 'signUp' }, display: 'single' }} />
    )
}