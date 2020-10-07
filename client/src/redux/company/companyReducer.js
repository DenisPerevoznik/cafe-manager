import { ADD_COMPANY, GET_COMPANIES, CLEAR_COMPANIES, SELECT_COMPANY } from "../types";

const initialState = {
    companies: [],
    selectedCompany: null
};

export const companyReducer = (state = initialState, action) => {

    switch (action.type) {
        case ADD_COMPANY:
            return {...state, companies: action.payload.companies}
    
        case GET_COMPANIES:
            return {...state, companies: action.payload};

        case CLEAR_COMPANIES:
            return {...state, ...initialState}

        case SELECT_COMPANY:
            return {...state, selectedCompany: action.payload};
        default:
            return state;
    }
}