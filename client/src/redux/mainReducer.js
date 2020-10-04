import {SHOW_LOADER, HIDE_LOADER, TOGGLE_MODAL, ERROR, CLEAR_ERROR} from './types';

const initialState = {
    loader: false,
    toggleModal: false,
    error: {}
};

export const mainReducer = (state = initialState, action) => {

    switch (action.type) {
        case SHOW_LOADER:
            return {...state, loader: true};
    
        case HIDE_LOADER:
            return {...state, loader: false};

        case TOGGLE_MODAL:
            return {...state, toggleModal: !state.toggleModal};

        case ERROR:
            return {...state, error: action.payload};

        case CLEAR_ERROR:{
            return {...state, error: {}};
        }
        default:
            return state;
    }
}