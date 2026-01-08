import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../Core/hooks';
import { getUser, setLoggingIn } from '../Store/Auth';

function Redirect() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(getUser);

    useEffect(() => {
        if (user.accessToken === "" && user.status !== "unset" && user.status !== "loading"){
            dispatch(setLoggingIn(false));
            navigate('/');
        }
    }, [user]);

    return null;
}

export default Redirect;