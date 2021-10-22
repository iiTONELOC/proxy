import { useEffect, useState } from "react";
import auth from '../../../utilities/auth'
import { Redirect } from "../../Redirect";


export default function Authorization({ children, ...delegated }) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isAuthorized, setAuth] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    useEffect(() => {
        if (hasMounted) {
            const signedIn = auth.getProfile()
            if (signedIn) {
                setAuth(true)
            } else {
                setAuth(false)
            }
        }
    }, [hasMounted])
    if (!hasMounted) {
        return null;
    }
    return (
        isAuthorized ? (<div {...delegated}>{children}</div>) : (<Redirect />)
    )

};
