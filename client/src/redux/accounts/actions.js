import Axios from 'axios';
import { createErrorObject, generateHeaders } from '../../utils/utils';
import { createError, createMessgae, hideLoader, showLoader } from '../actions';
import { GET_ACCOUNTS } from '../types';

export function getAccounts(token, companyId) {
  return async (dispatch) => {
    dispatch(showLoader());
    Axios.get(`/api/accounts/${companyId}`, generateHeaders(token))
      .then((res) => {
        const { accounts, accountsTypes } = res.data;
        dispatch({ type: GET_ACCOUNTS, payload: { accounts, accountsTypes } });
      })
      .catch((err) => {
        dispatch(createError(createErrorObject(err)));
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
}

export function createAccount(data = {}, companyId, token) {
  return async (dispatch) => {
    dispatch(showLoader());
    Axios.post(
      '/api/accounts/create',
      { ...data, companyId },
      generateHeaders(token)
    )
      .then((res) => {
        dispatch(createMessgae({ text: res.data.message, type: 'success' }));
        dispatch(getAccounts(token, companyId));
      })
      .catch((err) => {
        dispatch(createError(createErrorObject(err)));
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
}

export function removeAccount(accountId, token, companyId) {
  return async (dispatch) => {
    dispatch(showLoader());
    Axios.delete(`/api/accounts/remove/${accountId}`, generateHeaders(token))
      .then((res) => {
        dispatch(createMessgae({ text: res.data.message, type: 'info' }));
      })
      .catch((err) => {
        dispatch(createError(createErrorObject(err)));
      })
      .finally(() => {
        dispatch(getAccounts(token, companyId));
      });
  };
}

export function changeTitle(title, accountId, token, companyId) {
  return async (dispatch) => {
    dispatch(showLoader());
    Axios.put(
      '/api/accounts/update',
      { title, accountId },
      generateHeaders(token)
    )
      .then((res) => {
        dispatch(createMessgae({ text: res.data.message, type: 'success' }));
      })
      .catch((err) => {
        dispatch(createError(createErrorObject(err)));
      })
      .finally(() => {
        dispatch(getAccounts(token, companyId));
      });
  };
}
