import { createContext } from "react";

function noop(){}

export const AuthContext = createContext({
    userId: null,
    token: null,
    login: noop,
    logout: noop
});