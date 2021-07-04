import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { CompanyService } from '@app/shared/services/company.service';
import { SelectCompany, SetCurrentUser } from '@app/store/actions/common.actions';
import { AppState } from '@app/store/state/app.state';
import { Store } from '@ngrx/store';
import { MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Company, User } from 'src/app/shared/interfaces';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-companies-page',
  templateUrl: './companies-page.component.html',
  styleUrls: ['./companies-page.component.scss']
})
export class CompaniesPageComponent implements OnInit, OnDestroy {

  @ViewChild('createCompanyModal') createCompanyModal;
  companies: Company[] = [];
  loader = true;
  createForm: FormGroup;
  modalLoader;
  submitted = false;
  unsubscribe: Subject<any> = new Subject<any>();
  constructor(private http: HttpClient, private toasts: ToastService, private company: CompanyService,
    private store: Store<AppState>, private router: Router, private modalService: MDBModalService) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {

    this.createForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required])
    });
    this.getCompanies();

    this.http.get('/api/auth/current-user')
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((user: User) => {
      this.store.dispatch(new SetCurrentUser(user));
    });
  }

  private getCompanies(){
    this.loader = true;
    this.http.get('api/companies')
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
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

  createCompanyClick(){
    this.createForm.reset();
    this.modalService.show(ModalComponent, {
      data: {
        content: this.createCompanyModal,
        title: "Новое заведение"
      }
    });
  }

  createSubmit(){
    this.submitted = true;
    if(this.createForm.invalid) return;

    this.modalLoader = true;
    const company: Company = {
      name: this.createForm.value.name,
      address: this.createForm.value.address
    };

    this.company.createCompany(company)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; this.submitted = false}))
    .subscribe(message => {

      this.createForm.reset();
      this.modalService.hide(1);
      this.toasts.show('success', message);
      this.getCompanies();
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }
}
