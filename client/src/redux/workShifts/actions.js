import Axios from "axios";
import { createErrorObject, generateHeaders } from "../../utils/utils";
import { createError, createMessgae, hideLoader, showLoader } from "../actions";
import { GET_WORK_SHIFTS } from "../types";

export function getAllWorkShifts(companyId, token){
    return async dispatch => {

        dispatch(showLoader());
        Axios.get(`/api/work-shifts/${companyId}`, generateHeaders(token))
        .then(res => {
            dispatch({type: GET_WORK_SHIFTS, payload: res.data.workShifts});
        })
        .catch(err => {
            dispatch(createError(createErrorObject(err)));
        })
        .finally(() => {dispatch(hideLoader())});
    };
}

export function removeWorkShifts(removeIds = [], token, companyId){
    return async dispatch => {
        
        dispatch(showLoader());
        Axios.post('/api/work-shifts/remove', {removeIds}, generateHeaders(token))
        .then(res => {

            dispatch(getAllWorkShifts(companyId, token));
            dispatch(createMessgae({text: res.data.message, type: 'info'}));
        })
        .catch(err => {
            dispatch(createError(createErrorObject(err)));
        })
        .finally(() => {dispatch(hideLoader())});
    };
}