import { SHOW_LOADER, HIDE_LOADER, TOGGLE_MODAL, ERROR, CLEAR_ERROR } from "./types";

export function showLoader(){

    return{
        type: SHOW_LOADER,
        payload: true
    };
}

export function hideLoader(){
    return{
        type: HIDE_LOADER,
        payload: false
    };
}

export function toggleModal(){
    return {
        type: TOGGLE_MODAL
    };
}

export function createError(error = {}){

    return {
        type: ERROR,
        payload: error
    };
}

export function clearError(){
    return {type: CLEAR_ERROR};
}