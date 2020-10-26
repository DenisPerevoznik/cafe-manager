import { combineReducers } from 'redux';
import { accountsReducer } from './accounts/accountsReducer';
import { chartReducer } from './charts/chartsReducer';
import { companyReducer } from './company/companyReducer';
import { mainReducer } from './mainReducer';
import { workShiftReducer } from './workShifts/workShiftReducer';

export const rootReducer = combineReducers({
  main: mainReducer,
  company: companyReducer,
  charts: chartReducer,
  workShifts: workShiftReducer,
  accounts: accountsReducer,
});
