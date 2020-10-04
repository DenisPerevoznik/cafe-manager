import { SHOW_LOADER, HIDE_LOADER, ERROR, CLEAR_ERROR, MESSAGE, CLEAR_MESSAGE } from "./types";

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

// Уведомления
export function createError(error = {}){

    return {
        type: ERROR,
        payload: error
    };
}
export function clearError(){
    return {type: CLEAR_ERROR};
}

export function createMessgae(message = {text: 'Текст сообщения не задан', type: 'info'}){
    return {
        type: MESSAGE,
        payload: message
    };
}

export function clearMessage(){
    return {type: CLEAR_MESSAGE};
}