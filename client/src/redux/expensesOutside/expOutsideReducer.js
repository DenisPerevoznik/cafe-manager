import { GET_EXP_OUTSIDE } from '../types';

const initialState = {
  expensesOutside: [],
};

export const expOutsideReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EXP_OUTSIDE:
      return { ...state, expensesOutside: action.payload };

    default:
      return state;
  }
};
