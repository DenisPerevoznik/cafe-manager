import Axios from 'axios';
import { createErrorObject, generateHeaders } from '../../utils/utils';
import { createError, createMessgae, hideLoader, showLoader } from '../actions';
import { GET_EXP_OUTSIDE } from '../types';

export function getExpensesOutside(token, companyId) {
  return async (dispatch) => {
    dispatch(showLoader());
    Axios.get(`/api/expenses-outside/${companyId}`, generateHeaders(token))
      .then((res) => {
        dispatch({ type: GET_EXP_OUTSIDE, payload: res.data.expenses });
      })
      .catch((err) => {
        dispatch(createError(createErrorObject(err)));
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
}

export function createExpenseOutside(data = {}, token, companyId) {
  return async (dispatch) => {
    dispatch(showLoader());
    Axios.post(
      '/api/expenses-outside/create',
      { ...data, CompanyId: companyId },
      generateHeaders(token)
    )
      .then((res) => {
        dispatch(createMessgae({ text: res.data.message, type: 'success' }));
        dispatch(getExpensesOutside(token, companyId));
      })
      .catch((err) => {
        dispatch(createError(createErrorObject(err)));
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
}

export function removeExpenseOutside(returnToCell, expense, token, companyId) {
  return async (dispatch) => {
    dispatch(showLoader());
    Axios.post(
      '/api/expenses-outside/remove',
      { returnToCell, expense },
      generateHeaders(token)
    )
      .then((res) => {
        dispatch(createMessgae({ text: res.data.message, type: 'info' }));
      })
      .catch((err) => {
        dispatch(createError(createErrorObject(err)));
      })
      .finally(() => {
        dispatch(getExpensesOutside(token, companyId));
      });
  };
}

export function updateExpenseOutside(
  updatedData,
  oldExpenseObject,
  token,
  companyId
) {
  return async (dispatch) => {
    dispatch(showLoader());
    Axios.put(
      '/api/expenses-outside/update',
      { oldExpense: oldExpenseObject, newExpense: updatedData },
      generateHeaders(token)
    )
      .then((res) => {
        dispatch(createMessgae({ text: res.data.message, type: 'success' }));
      })
      .catch((err) => {
        dispatch(createError(createErrorObject(err)));
      })
      .finally(() => {
        dispatch(getExpensesOutside(token, companyId));
      });
  };
}
