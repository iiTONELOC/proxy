import { useEffect, useState } from "react";
import auth from '../../../utilities/auth'
import { Redirect } from "../../Redirect";


export default function Authorization({ children, ...delegated }) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isAuthorized, setAuth] = useState(false);
    useEffect(() => {
        setHasMounted(true);
        return () => setHasMounted(false);
    }, []);
    useEffect(() => {
        if (hasMounted) {
            const userLoggedIn = auth.loggedIn()
            if (userLoggedIn) {
                const signedIn = auth.getProfile()
                console.log(`AUTH`, signedIn)
                if (signedIn) {

                    setAuth(true)
                } else {
                    localStorage.removeItem('proxy_id_token')
                    setAuth(false)
                }
            } else {
                localStorage.removeItem('proxy_id_token')
                setAuth(false)
            }

        }
    })
    if (!hasMounted) {
        return null;
    }
    return (
        isAuthorized === true ? (<div {...delegated}>{children}</div>) : (<Redirect />)
    )

};
