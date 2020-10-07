import Axios from "axios"
import { createErrorObject } from "../../utils/utils"
import { createError } from "../actions"
import { GET_DAILY_CHART } from "../types"

export function getDeilyChartData(yearAndMonth, token, companyId){
    return async dispatch => {

        Axios.post('/api/analytics/daily', {yearAndMonth, companyId}, 
        {headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`}})
        .then(res => {
            dispatch({type: GET_DAILY_CHART, payload: res.data});
        })
        .catch(error => {
            dispatch(createError(createErrorObject(error)));
        })
    }
}