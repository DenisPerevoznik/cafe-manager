import {Company, WorkShift} from '../../shared/interfaces';

export interface CommonState {
    selectedCompany: Company;
}

export const initialCommonState: CommonState = {
    selectedCompany: null,
}