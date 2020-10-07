import { combineReducers } from "redux";
import { chartReducer } from "./charts/chartsReducer";
import { companyReducer } from "./company/companyReducer";
import {mainReducer} from './mainReducer';

export const rootReducer = combineReducers({
    
    main: mainReducer,
    company: companyReducer,
    charts: chartReducer
});