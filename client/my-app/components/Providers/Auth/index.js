import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import auth from '../../../utilities/auth'
import { reduxSetMe } from "../../../utilities/redux/helpers";
import { Redirect } from "../../Redirect";

function handleExpiredToken(dispatch, setAuth) {
    localStorage.removeItem('proxy_id_token')
    reduxSetMe({ me: null, dispatch })
    setAuth(false)
    window.location.reload()
}

export default function Authorization({ children, ...delegated }) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isAuthorized, setAuth] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        setHasMounted(true);
        const userLoggedIn = auth.loggedIn();
        console.log(`AUTH`, userLoggedIn)
        if (userLoggedIn) {
            const signedIn = auth.getProfile();
            if (signedIn) {
                reduxSetMe({ me: signedIn.data, dispatch });
                setAuth(true);
            } else {
                handleExpiredToken(dispatch, setAuth);
            };
        } else {
            handleExpiredToken(dispatch, setAuth);
        };
        return () => setHasMounted(false);
    }, []);

    if (!hasMounted) return null;

    return (
        isAuthorized === true ? (<div {...delegated}>{children}</div>) : (<Redirect />)
    );

};
