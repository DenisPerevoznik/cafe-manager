import { CommonActions, ECommonActions } from "../actions/common.actions";
import { CommonState, initialCommonState } from "../state/common.state";

export const commonReducers = (state = initialCommonState, action: CommonActions): CommonState => {

    switch (action.type) {
        case ECommonActions.SelectCompany:
            return {...state, selectedCompany: action.payload}
    
        default:
            return state;
    }
}