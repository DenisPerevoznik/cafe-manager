import {
  SHOW_LOADER,
  HIDE_LOADER,
  ERROR,
  CLEAR_ERROR,
  MESSAGE,
  CLEAR_MESSAGE,
  SIDEBAR_TOGGLE,
} from './types';

const initialState = {
  loader: false,
  error: {},
  message: {},
  sidebarStatus: true,
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOADER:
      return { ...state, loader: true };

    case HIDE_LOADER:
      return { ...state, loader: false };

    case ERROR:
      return { ...state, error: action.payload };

    case CLEAR_ERROR:
      return { ...state, error: {} };

    case MESSAGE:
      return { ...state, message: action.payload };

    case CLEAR_MESSAGE:
      return { ...state, message: {} };

    case SIDEBAR_TOGGLE:
      return { ...state, sidebarStatus: action.payload };
    default:
      return state;
  }
};
