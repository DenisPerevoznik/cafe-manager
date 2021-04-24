import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getSelectedCompany } from '@app/store/selectors/common.selector';
import { AppState } from '@app/store/state/app.state';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { Account, Category, Company, Expense, Ingredient, Product, WorkShift } from '../interfaces';

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

  // CATEGORIES:
  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(`/api/categories/${this.selectedCompany.id}`);
  }

  createCategory(category: Category): Observable<string>{
    return this.http.post<{category: Category, message: string}>('/api/categories/create', category)
    .pipe(map(resp => resp.message));
  }

  getCategoryById(id: string | number): Observable<Category>{
    return this.http.get<Category>(`/api/categories/get/${id}`);
  }

  updateCategory(category: Category, categoryId: string | number): Observable<string>{
    return this.http.put<any>(`/api/categories/update/${categoryId}`, category)
    .pipe(map(resp => resp.message));
  }

  removeCategory(id): Observable<string>{
    return this.http.delete<any>(`/api/categories/remove/${id}`)
    .pipe(map(resp => resp.message));;
  }

    // INGREDIENTS:
    getIngredients(): Observable<Ingredient[]>{
      return this.http.get<Ingredient[]>(`/api/ingredients/${this.selectedCompany.id}`);
    }
  
    createIngredient(ingredient: Ingredient): Observable<string>{
      ingredient.price = 0;
      ingredient.quantity = 0;
      return this.http.post<{ingredient: Ingredient, message: string}>('/api/ingredients/create', ingredient)
      .pipe(map(resp => resp.message));
    }
  
    getIngredientById(id: string | number): Observable<Ingredient>{
      return this.http.get<Ingredient>(`/api/ingredients/get/${id}`);
    }
  
    updateIngredient(ingredient: Ingredient, ingredientId: string | number): Observable<string>{
      return this.http.put<any>(`/api/ingredients/update/${ingredientId}`, ingredient)
      .pipe(map(resp => resp.message));
    }
  
    removeIngredient(id): Observable<string>{
      return this.http.delete<any>(`/api/ingredients/remove/${id}`)
      .pipe(map(resp => resp.message));;
    }

    // PRODUCTS:
    getProducts(): Observable<Product[]>{
      return this.http.get<Product[]>(`/api/products/${this.selectedCompany.id}`);
    }
  
    createProduct(product: Product, ingredients: {id: number, usingInOne: number}[]): Observable<string>{
      return this.http.post<{product: Product, message: string}>('/api/products/create', {product, ingredients})
      .pipe(map(resp => resp.message));
    }
  
    getProductById(id: string | number): Observable<Product>{
      return this.http.get<Product>(`/api/products/get/${id}`);
    }
  
    updateProduct(product: Product, productId: number, ingredients: {id: number, usingInOne: number}[]): Observable<string>{
      return this.http.put<any>(`/api/products/update/${productId}`, {product, ingredients})
      .pipe(map(resp => resp.message));
    }
  
    removeProduct(id): Observable<string>{
      return this.http.delete<any>(`/api/products/remove/${id}`)
      .pipe(map(resp => resp.message));;
    }
}
