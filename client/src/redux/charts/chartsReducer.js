import { GET_DAILY_CHART, GET_FINANCE_CHART, GET_MONTHLY_CHART } from "../types";

const initialState = {
    dailyChartData: {},
    monthlyChartData: {},
    financeChartData: {}
};

export const chartReducer = (state = initialState, action) => {

    switch (action.type) {
        case GET_DAILY_CHART:
            return {...state, dailyChartData: action.payload};

        case GET_MONTHLY_CHART:
            return {...state, monthlyChartData: action.payload}

        case GET_FINANCE_CHART:
            return {...state, financeChartData: action.payload};
    
        default:
            return state;
    }
};