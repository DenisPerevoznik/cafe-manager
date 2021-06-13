import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { Account } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { SelectCompany } from '@app/store/actions/common.actions';
import { Store } from '@ngrx/store';
import { MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {

  @ViewChild('removeModal') removeModal;
  form: FormGroup;
  accounts: Account[] = [];
  companyName = '';
  modalLoader = false;
  loader = true;
  submitted = false;

  private unsubscribe: Subject<void> = new Subject();
  constructor(private company: CompanyService, private modalService: MDBModalService,
              private store: Store, private toast: ToastService) { }

  ngOnInit(): void {

    this.companyName = this.company.selectedCompany.name;

    this.form = new FormGroup({
      terminalAccount: new FormControl(this.company.selectedCompany.mainAccount),
      companyName: new FormControl(this.companyName, [Validators.required])
    });

    this.company.getAccounts()
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  removeClick(){
    this.modalService.show(ModalComponent, {
      data: {
        title: `Удаление`,
        content: this.removeModal
      }
    });
  }

  confirmToRemove(){
    this.loader = true;

    this.company.removeCompany()
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(message => {
      this.store.dispatch(new SelectCompany(null));
      window.location.reload();
      this.toast.show('info', message);
    }, response => {
      this.toast.show('error', response.error.message);
    });
  }

  saveChanges(){
    this.submitted = true;
    if (this.form.invalid) { return; }

    this.loader = true;
    const mainAccount = this.form.value.terminalAccount;
    const name = this.form.value.companyName;

    this.company.updateCompany(name, mainAccount)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false; }))
    .subscribe(message => {
      this.store.dispatch(new SelectCompany({...this.company.selectedCompany, mainAccount, name}));
      this.companyName = name;
      this.toast.show('success', message);
    }, response => {
      this.toast.show('error', response.error.message);
    });
  }
}
