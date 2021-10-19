import { useEffect, useState } from "react";
import auth from '../../../utilities/auth'
import { Redirect } from "../../Redirect";
export function loggedIn() {
    const token = auth.getToken()
    if (token) {
        // check if expired
        const notExpired = auth.isTokenExpired(token);
        if (notExpired) {
            return (true)
        }
    } else {
        return (false)
    }
}

export default function Authorization({ children, ...delegated }) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isAuthorized, setAuth] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    useEffect(() => {
        if (hasMounted) {
            const signedIn = loggedIn()
            if (signedIn) {
                setAuth(true)
            } else {
                setAuth(false)
            }
        }
    }, [hasMounted])
    if (!hasMounted) {
        return null;
    } else if (!isAuthorized) {

        return (
            <Redirect />
        )
    } else {
        return <div {...delegated}>{children}</div>;
    }

};