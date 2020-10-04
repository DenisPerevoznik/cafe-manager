import { combineReducers } from "redux";
import { companyReducer } from "./company/companyReducer";
import {mainReducer} from './mainReducer';

export const rootReducer = combineReducers({
    
    main: mainReducer,
    company: companyReducer
});