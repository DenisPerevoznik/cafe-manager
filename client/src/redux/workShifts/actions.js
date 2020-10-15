import Axios from "axios";
import { createErrorObject, generateHeaders } from "../../utils/utils";
import { createError, hideLoader, showLoader } from "../actions";
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