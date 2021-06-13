import { Action } from '@ngrx/store';
import { Company } from 'src/app/shared/interfaces';


export enum ECommonActions {
    SelectCompany = '[Company] Select company',
}

export class SelectCompany implements Action{

    public readonly type = ECommonActions.SelectCompany;
    constructor(public payload: Company){}
}

export type CommonActions = SelectCompany;
