import { GET_WORK_SHIFTS } from "../types";

const initialState = {
    workShifts: []
};

export const workShiftReducer = (state = initialState, action) => {

    switch (action.type) {
        case GET_WORK_SHIFTS:
            return {...state, workShifts: action.payload};
    
        default:
            return state;
    }
}