import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { getSelectedCompany } from '@app/store/selectors/common.selector';
import { AppState } from '@app/store/state/app.state';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { first, map, mergeMap, takeUntil } from 'rxjs/operators';
import { Company, Expense, WorkShift } from '../interfaces';

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
  getAccounts(): Observable<Account[]>{
    return this.http.get<{accounts: Account[]}>(`/api/accounts/${this.selectedCompany.id}`)
    .pipe(map(response => response.accounts));  
  }
}
