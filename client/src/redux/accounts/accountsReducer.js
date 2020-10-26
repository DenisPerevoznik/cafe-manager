import { CREATE_ACCOUNT, GET_ACCOUNTS } from '../types';

const initialState = {
  accountsData: { accounts: [], accountsTypes: [] },
};

export const accountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNTS:
      return { ...state, accountsData: action.payload };

    default:
      return state;
  }
};
