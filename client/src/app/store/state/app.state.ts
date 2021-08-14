import { CommonState, initialCommonState } from "./common.state";

export interface AppState{
    common: CommonState
}

export const initialAppState: AppState = {
    common: initialCommonState
}

export function getInitialState(): AppState{
    return initialAppState;
}