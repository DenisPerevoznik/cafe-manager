import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getSelectedCompany } from '@app/store/selectors/common.selector';
import { AppState } from '@app/store/state/app.state';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { Account, Company, Expense, WorkShift } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  unsubscribe: Subject<any> = new Subject<any>();
  selectedCompany: Company = {createdAt: null, id: 0, name: null, updatedAt: null};
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  getWorkShifts(id = null): Observable<WorkShift[] | WorkShift>{

    return this.store.select(getSelectedCompany)
    .pipe(first(), mergeMap((company: Company) => {

      if(id){
        return this.http.get<{shift: WorkShift}>(`/api/work-shifts/get/${id}`)
        .pipe(map(response => response.shift));
      } else if(company){
        return this.http.get<{workShifts: WorkShift[]}>(`/api/work-shifts/${company.id}`)
        .pipe(map(response => response.workShifts));
      }
    }));
  }
  
  getWorkShiftByDate(date: string | number): Observable<WorkShift[]>{

    if(typeof date !== 'string'){
      date = date.toString();
    }

    return this.http.post<WorkShift[]>(`/api/work-shifts/get-by-date`, {date})
      .pipe(map(response => response));
  }

  removeWorkShift(id): Observable<any>{
    return this.http.post('/api/work-shifts/remove', {removeIds: [id]});
  }

  // EXPENSES:
  getExpenses(): Observable<Expense[]>{

    return this.http.get<{expenses: Expense[]}>(`/api/expenses-outside/${this.selectedCompany.id}`)
      .pipe(map(response => response.expenses));
  }

  createExpense(expense: Expense): Observable<string>{

    expense.CompanyId = this.selectedCompany.id;
    return this.http.post<any>('/api/expenses-outside/create', expense)
    .pipe(map(resp => resp.message));
  }

  removeExpense(returnToCell: boolean, expense: Expense): Observable<string> {

    return this.http.post<any>('/api/expenses-outside/remove', {returnToCell, expense})
    .pipe(map(resp => resp.message));
  }

  // ACCOUNTS:
  getAccounts(withoutMain: boolean = false): Observable<Account[]>{
    return this.http.get<{accounts: Account[]}>(`/api/accounts/${this.selectedCompany.id}`)
    .pipe(map(response => {

      const accounts = response.accounts.map(acc => ({...acc, balance: parseFloat(acc.balance.toString())}));
      if(withoutMain){
        return accounts.filter(acc => acc.id !== this.selectedCompany.mainAccount)
      }

      return accounts;
    }));  
  }

  createAccount(account: Account): Observable<string>{
    return this.http.post<any>('/api/accounts/create', account)
    .pipe(map(resp => resp.message));
  }

  removeAccount(accountId): Observable<string>{
    return this.http.delete<any>(`/api/accounts/remove/${accountId}`)
    .pipe(map(resp => resp.message));
  }

  topUpAccountBalance(balance: number, account: Account): Observable<string>{

    const readyBalance = account.balance + balance;
    return this.http.put<any>('/api/accounts/update-balance', {balance: readyBalance, accountId: account.id})
    .pipe(map(resp => resp.message));
  }
}
