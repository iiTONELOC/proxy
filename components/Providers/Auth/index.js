import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import auth from '../../../utilities/auth'
import { reduxSetMe } from "../../../utilities/redux/helpers";
import { Redirect } from "../../Redirect";

function handleExpiredToken(dispatch, setAuth) {
    localStorage.removeItem('proxy_id_token')
    reduxSetMe({ me: null, dispatch })
    setAuth(false)

}

export default function Authorization({ children, ...delegated }) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isAuthorized, setAuth] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        setHasMounted(true);
        const userLoggedIn = auth.loggedIn();
        if (userLoggedIn) {
            const signedIn = auth.getProfile();
            if (signedIn) {
                reduxSetMe({ me: signedIn.data, dispatch });
                setAuth(true); setTimeout(() => { handleExpiredToken(dispatch, setAuth); document.location.assign('/sign-in') }, (60 * 1439.45 * 1000))
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
