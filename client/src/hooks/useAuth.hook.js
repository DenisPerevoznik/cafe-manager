import { useCallback, useEffect, useState } from 'react';

export const useAuth = () => {

    const storageKey = 'auth-storage';
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    

    const login = useCallback((_userId, _token) => {

        setToken(_token);
        setUserId(_userId);
        localStorage.setItem(storageKey, JSON.stringify({userId: _userId, token: _token}));
    }, [])

    const logout = useCallback(() => {

        localStorage.removeItem(storageKey);
        setUserId(null);
        setToken(null);
    });

    useEffect(() => {

        const data = JSON.parse(localStorage.getItem(storageKey));

        if(data && data.token){
            login(data.userId, data.token);
        }
    }, [login]);

    return {userId, token, login, logout};
}