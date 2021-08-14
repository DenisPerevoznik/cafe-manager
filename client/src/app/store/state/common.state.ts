import {Company, User, WorkShift} from '../../shared/interfaces';

export interface CommonState {
    selectedCompany: Company;
    currentUser: User
}

export const initialCommonState: CommonState = {
    selectedCompany: null,
    currentUser: null
}