import { Action } from '@ngrx/store';
import { Company, User } from 'src/app/shared/interfaces';


export enum ECommonActions {
    SelectCompany = '[Company] Select company',
    SetCurrentUser = '[User] Set current user'
}

export class SelectCompany implements Action{

    public readonly type = ECommonActions.SelectCompany;
    constructor(public payload: Company){}
}

export class SetCurrentUser implements Action{

    public readonly type = ECommonActions.SetCurrentUser;
    constructor(public payload: User){}
}

export type CommonActions = SelectCompany | SetCurrentUser;
