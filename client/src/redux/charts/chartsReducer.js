import { GET_DAILY_CHART } from "../types";

const initialState = {
    dailyChartData: {}
};

export const chartReducer = (state = initialState, action) => {

    switch (action.type) {
        case GET_DAILY_CHART:
            return {...state, dailyChartData: action.payload};
    
        default:
            return state;
    }
};