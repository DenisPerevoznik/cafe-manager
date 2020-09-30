import { SIGNIN } from "./types";

export function createLoginData(userId, token){

    return {
        type: SIGNIN,
        payload: {
            userId,
            token
        }
    }
}