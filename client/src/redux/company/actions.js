import axios from "axios";
import { createError, hideLoader, showLoader } from "../actions";
import { ADD_COMPANY, CLEAR_COMPANIES, GET_COMPANIES } from "../types";
import {createErrorObject} from '../../utils/utils';

export function createCompany(data = {}, token){
    return async dispatch => {

        dispatch(showLoader());
        axios.post('/api/companies/create', data, 
            {headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`}})
            .then(res => {
                dispatch(hideLoader());
                const {createdCompany, companies} = res.data;

                dispatch({type: ADD_COMPANY, payload: {
                    createdCompany,
                    companies
                }});
            })
            .catch(err => {
                dispatch(createError(createErrorObject(err)));
            });
    }
}

export function getCompanies(token){
    return async dispatch => {

        dispatch(showLoader());
        await axios.get(`/api/companies/`, 
            {headers: {Authorization: `Bearer ${token}`}})
            .then(res => {
                dispatch(hideLoader());
                const {companies} = res.data;
                dispatch({type: GET_COMPANIES, payload: companies});
            })
            .catch(err => {
                dispatch(createError(createErrorObject(err)));
            });
    }
}

export function clearCompanies(){
    return {
        type: CLEAR_COMPANIES
    }
}