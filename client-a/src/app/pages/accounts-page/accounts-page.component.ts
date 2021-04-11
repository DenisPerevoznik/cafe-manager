import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { Account } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-accounts-page',
  templateUrl: './accounts-page.component.html',
  styleUrls: ['./accounts-page.component.scss']
})
export class AccountsPageComponent implements OnInit, OnDestroy {

  @ViewChild('createAccModal') createModal;
  @ViewChild('removeAccModal') removeModal;
  @ViewChild('topUpBalanceModal') topUpBalanceModal;

  accounts: Account[] = [];
  returnSumToAcc = true;
  selectedAccount: Account = null;
  unsubscribe: Subject<any> = new Subject<any>();
  loader;
  topUpBalance = 0;
  modalLoader = false;
  createForm: FormGroup;
  formSubmitted = false;

  constructor(private company: CompanyService, private toastService: ToastService,
    private modalService: MDBModalService) { }
    
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {

    this.createForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      balance: new FormControl(0)
    });
    this.getAccounts();
  }

  getAccounts(){
    this.loader = true;
    this.company.getAccounts()
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  onCreateClick(){

    this.modalService.show(ModalComponent, {
      data: {
        content: this.createModal,
        title: "Создание ячейки"
      }
    });
  }

  createAccount(){
    this.formSubmitted = true;
    if(this.createForm.invalid) return;

    this.modalLoader = true;
    const account: Account = {
      balance: this.createForm.value.balance,
      title: this.createForm.value.title
    };

    this.company.createAccount(account)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false}))
    .subscribe(message => {

      this.formSubmitted = false;
      this.modalService.hide(1);
      this.toastService.show('success', message);
      this.createForm.reset();
      this.getAccounts();
    }, response => {
      this.toastService.show('error', response.error.message);
    });
  }

  removeAccount(){

    if(!this.selectedAccount) return;

    this.modalLoader = true;
    this.company.removeAccount(this.selectedAccount.id)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false}))
    .subscribe(message => {

      this.modalService.hide(1);
      this.getAccounts();
      this.toastService.show('info', message);
    }, resp => {
      this.toastService.show('error', resp.error.message);
    });
  }

  onRemoveClick(account: Account){
    
    this.selectedAccount = account;
    this.modalService.show(ModalComponent, {
      data: {
        content: this.removeModal,
        title: "Удаление ячейки"
      }
    });
  }

  topUpBalanceClick(){
    if(!this.selectedAccount) return;

    this.modalLoader = true;
    this.company.topUpAccountBalance(this.topUpBalance, this.selectedAccount)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false}))
    .subscribe(message => {

      this.topUpBalance = 0;
      this.modalService.hide(1);
      this.getAccounts();
      this.toastService.show('success', message);
    }, response => {
      this.toastService.show('error', response.error.message);
    });
  }

  openUpdateBalanceModal(account: Account){

    this.selectedAccount = account;
    this.modalService.show(ModalComponent, {
      data: {
        content: this.topUpBalanceModal,
        title: `Пополнение баланса для ${this.selectedAccount.title}`
      }
    })
  }
}
