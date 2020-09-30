
import {SIGNIN} from './types';

const initialState = {
    userId: null,
    token: null
};

export const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case SIGNIN:
            return {...state, token: action.payload.token, userId: action.payload.userId};
    
        default:
            return state;
    }
}