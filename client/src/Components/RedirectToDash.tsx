import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../Core/hooks';
import { getUser } from '../Store/Auth';

function RedirectToDash() {
    
    const navigate = useNavigate();
    const user = useAppSelector(getUser);

    useEffect(() => {
        if (user.accessToken !== ""){
            navigate('/dash', { replace: true }); 
        }
    }, [user.accessToken, navigate]);

    return null;
}

export default RedirectToDash;