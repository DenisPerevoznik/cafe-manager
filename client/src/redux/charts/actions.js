import Axios from 'axios';
import { createErrorObject, generateHeaders } from '../../utils/utils';
import { createError, hideLoader, showLoader } from '../actions';
import {
  GET_DAILY_CHART,
  GET_FINANCE_CHART,
  GET_MONTHLY_CHART,
} from '../types';

export function getDailyChartData(yearAndMonth, token, companyId) {
  return async (dispatch) => {
    dispatch(showLoader());
    Axios.post(
      '/api/analytics/daily',
      { yearAndMonth, companyId },
      generateHeaders(token)
    )
      .then((res) => {
        dispatch({ type: GET_DAILY_CHART, payload: res.data });
      })
      .catch((error) => {
        dispatch(createError(createErrorObject(error)));
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
}

export function getMonthlyChartData(year, token, companyId) {
  return async (dispatch) => {
    dispatch(showLoader());
    Axios.post(
      '/api/analytics/monthly',
      { year, companyId },
      generateHeaders(token)
    )
      .then((res) => {
        dispatch({ type: GET_MONTHLY_CHART, payload: res.data });
      })
      .catch((err) => {
        dispatch(createError(createErrorObject(err)));
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
}

export function getFinanceChartData(token, companyId) {
  return async (dispatch) => {
    Axios.post('/api/analytics/finance', { companyId }, generateHeaders(token))
      .then((res) => {
        dispatch({ type: GET_FINANCE_CHART, payload: res.data });
      })
      .catch((err) => {
        dispatch(createError(createErrorObject(err)));
      });
  };
}
