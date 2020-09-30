import {SHOW_LOADER, HIDE_LOADER} from './types';

const initialState = {
    loader: false
};

export const mainReducer = (state = initialState, action) => {

    switch (action.type) {
        case SHOW_LOADER:
            return {...state, loader: true};
    
        case HIDE_LOADER:
            return {...state, loader: false}
        default:
            return state;
    }
}