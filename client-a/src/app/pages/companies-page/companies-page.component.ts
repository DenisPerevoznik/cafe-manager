import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectCompany } from '@app/store/actions/common.actions';
import { AppState } from '@app/store/state/app.state';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Company } from 'src/app/shared/interfaces';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-companies-page',
  templateUrl: './companies-page.component.html',
  styleUrls: ['./companies-page.component.scss']
})
export class CompaniesPageComponent implements OnInit, OnDestroy {

  companies: Company[] = [];
  unsubscribe: Subject<any> = new Subject<any>();
  constructor(private http: HttpClient, private toasts: ToastService, 
    private store: Store<AppState>, private router: Router) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.http.get('api/companies')
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((response: any)=> {
      this.companies = response.companies;
    }, res => {
      if(res.status === 401){
        this.toasts.show('alert', res.error.message);
        return;
      }
      this.toasts.show('error', res.error.message);
    });
  }

  onCompanyClick(company: Company){
    this.store.dispatch(new SelectCompany(company));
    this.router.navigate(['dashboard']);
  }
}
