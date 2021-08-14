import { createSelector } from "@ngrx/store";
import { AppState } from "../state/app.state";
import { CommonState } from "../state/common.state";

const selectCommon = (state: AppState) => state.common;

export const getSelectedCompany = createSelector(selectCommon, (state: CommonState) => state.selectedCompany);
export const getCurrentUser = createSelector(selectCommon, (state: CommonState) => state.currentUser);