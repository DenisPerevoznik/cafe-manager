import { combineReducers } from 'redux';
import { accountsReducer } from './accounts/accountsReducer';
import { chartReducer } from './charts/chartsReducer';
import { companyReducer } from './company/companyReducer';
import { mainReducer } from './mainReducer';
import { workShiftReducer } from './workShifts/workShiftReducer';
import { expOutsideReducer } from './expensesOutside/expOutsideReducer';

export const rootReducer = combineReducers({
  main: mainReducer,
  company: companyReducer,
  charts: chartReducer,
  workShifts: workShiftReducer,
  accounts: accountsReducer,
  expOutside: expOutsideReducer,
});
