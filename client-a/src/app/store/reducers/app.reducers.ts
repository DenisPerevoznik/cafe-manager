import { ActionReducerMap } from "@ngrx/store";
import { commonReducers } from "./common.reducers";
import { AppState } from "../state/app.state";

export const appReducers: ActionReducerMap<AppState, any> = {
    common: commonReducers,
};