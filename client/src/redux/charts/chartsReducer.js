import { GET_DAILY_CHART, GET_MONTHLY_CHART } from "../types";

const initialState = {
    dailyChartData: {},
    monthlyChartData: {}
};

export const chartReducer = (state = initialState, action) => {

    switch (action.type) {
        case GET_DAILY_CHART:
            return {...state, dailyChartData: action.payload};

        case GET_MONTHLY_CHART:
            return {...state, monthlyChartData: action.payload}
    
        default:
            return state;
    }
};