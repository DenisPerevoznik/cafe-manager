import axios from "axios";
import { createError, createMessgae, hideLoader, showLoader } from "../actions";
import { ADD_COMPANY, CLEAR_COMPANIES, GET_COMPANIES, SELECT_COMPANY } from "../types";
import {createErrorObject} from '../../utils/utils';

export function createCompany(data = {}, token){
    return async dispatch => {

        dispatch(showLoader());
        axios.post('/api/companies/create', data, 
            {headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`}})
            .then(res => {
                const {createdCompany, companies, message} = res.data;

                dispatch({type: ADD_COMPANY, payload: {
                    createdCompany,
                    companies
                }});
                dispatch(createMessgae({text: message, type: 'success'}));
            })
            .catch(err => {
                dispatch(createError(createErrorObject(err)));
            })
            .finally(() => {dispatch(hideLoader())});
    }
}

export function getCompanies(token){
    return async dispatch => {

        dispatch(showLoader());
        await axios.get(`/api/companies/`, 
            {headers: {Authorization: `Bearer ${token}`}})
            .then(res => {
                const {companies} = res.data;
                dispatch({type: GET_COMPANIES, payload: companies});
            })
            .catch(err => {
                dispatch(createError(createErrorObject(err)));
            })
            .finally(() => {dispatch(hideLoader())});
    }
}

export function clearCompanies(){
    return {
        type: CLEAR_COMPANIES
    }
}

export function selectCompany(company){
    return {
        type: SELECT_COMPANY,
        payload: company
    }
}