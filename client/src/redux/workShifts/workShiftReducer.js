import { GET_WORK_SHIFTS, SELECT_WORK_SHIFT } from '../types';

const initialState = {
  workShifts: [],
  selected: {},
};

export const workShiftReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WORK_SHIFTS:
      return { ...state, workShifts: action.payload };

    case SELECT_WORK_SHIFT:
      return { ...state, selected: action.payload };

    default:
      return state;
  }
};
