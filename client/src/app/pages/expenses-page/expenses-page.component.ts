import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { Account, Expense } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { MDBModalService } from 'angular-bootstrap-md';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-expenses-page',
  templateUrl: './expenses-page.component.html',
  styleUrls: ['./expenses-page.component.scss']
})
export class ExpensesPageComponent implements OnInit, OnDestroy {

  @ViewChild('createExpModal') createModal;
  @ViewChild('removeExpModal') removeModal;

  expenses: Expense[] = [];
  accounts: Account[] = [];
  mainAccount: Account = null;
  returnSumToAcc = true;
  selectedExpenseForRemove: Expense = null;
  unsubscribe: Subject<any> = new Subject<any>();
  loader;
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
    this.loader = true;
    this.getData();

    this.createForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      sum: new FormControl(10, [Validators.required, Validators.min(0.01)]),
      account: new FormControl(null, [Validators.required])
    });
  }

  getData(): void{

    forkJoin({
      expenses: this.company.getExpenses(),
      accountsData: this.company.getAccounts(true)
    })
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false; }))
    .subscribe(response => {
      this.expenses = response.expenses;
      this.accounts = response.accountsData.accounts;
      this.mainAccount = response.accountsData.mainAccount;
    });
  }

  onCreateClick(): void{
    this.modalService.show(ModalComponent, {
      data: {
        content: this.createModal,
        title: 'Добавление расхода'
      }
    });
  }

  onRemoveClick(expense: Expense): void{
    this.returnSumToAcc = true;
    this.selectedExpenseForRemove = expense;
    this.modalService.show(ModalComponent, {
      data: {
        content: this.removeModal,
        title: 'Удаление расхода'
      }
    });
  }

  createExpenseSubmit(): void{
    this.formSubmitted = true;
    if (this.createForm.invalid) { return; }

    this.modalLoader = true;
    const expense: Expense = {
      AccountId: this.createForm.value.account,
      CompanyId: null,
      // accountTitle: this.accounts.find(acc => acc.id == this.createForm.value.account).title,
      description: this.createForm.value.description,
      expenseAmount: this.createForm.value.sum
    };
    this.company.createExpense(expense)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; }))
    .subscribe(message => {
      this.formSubmitted = false;
      this.createForm.reset();
      this.toastService.show('success', message);
      this.modalService.hide(1);
      this.getData();
    }, response => {
      this.toastService.show('error', response.error.message);
    });
  }

  removeExpense(): void{
    this.modalLoader = true;

    if (!this.accountOfExpense) {
      this.returnSumToAcc = false;
    }

    this.company.removeExpense(this.returnSumToAcc, this.selectedExpenseForRemove)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false}))
    .subscribe(message => {

      this.modalService.hide(1);
      this.toastService.show('success', message);
      this.getData();
    }, response => {
      this.toastService.show('error', response.error.message);
    });
  }

  get accountOfExpense(): Account{
    if (!this.selectedExpenseForRemove){
      return null;
    }

    const foundAccount = this.accounts.find(acc => acc.id === this.selectedExpenseForRemove.AccountId);
    return !!foundAccount ? foundAccount : null;
  }
}
