import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { Employee } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-employees-page',
  templateUrl: './employees-page.component.html',
  styleUrls: ['./employees-page.component.scss']
})
export class EmployeesPageComponent implements OnInit, OnDestroy {

  @ViewChild('createModal') createModal;
  @ViewChild('removeModal') removeModal;
  loader;
  submitted;
  modalLoader;
  employees: Employee[] = [];
  selectedEmployee: Employee;
  unsubscribe: Subject<any> = new Subject();
  isEdit: boolean = false;
  createForm: FormGroup;
  constructor(private company: CompanyService, private toasts: ToastService,
    private modalService: MDBModalService) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {

    this.createForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      pinCode: new FormControl(null, [Validators.required, Validators.pattern(/^(\d{4}$)/)]),
    });
    this.getEmployees();
  }

  getEmployees(){
    this.loader = true;
    this.company.getEmployees()
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(employees => {this.employees = employees})
  }

  onCreateEmployeeClick(){
    this.isEdit = false;
    this.createForm.reset();
    this.modalService.show(ModalComponent, {
      data: {
        content: this.createModal,
        title: "Новый сотрудник"
      }
    });
  }

  removeClick(employee){
    this.selectedEmployee = employee;
    this.modalService.show(ModalComponent, {
      data: {
        title: `Удаление сотрудника ${employee.name}`,
        content: this.removeModal
      }
    });
  }

  removeEmployee(){
    this.modalLoader = true;
    this.company.removeEmployee(this.selectedEmployee.id)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false}))
    .subscribe(message => {

      this.modalService.hide(1);
      this.getEmployees();
      this.toasts.show('info', message);
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  editClick(employee){
    this.selectedEmployee = employee;
    this.createForm.patchValue(employee);
    this.isEdit = true;
    
    this.modalService.show(ModalComponent, {
      data: {
        content: this.createModal,
        title: `Изменение данных для ${employee.name}`
      }
    });
  }

  saveEmployeeChanges(){
    this.submitted = true;
    if(this.createForm.invalid) return;

    this.modalLoader = true;
    const employee = this.getFormData();
    this.company.updateEmployee(employee, this.selectedEmployee.id)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; this.submitted = false}))
    .subscribe(message => {

      this.createForm.reset();
      this.modalService.hide(1);
      this.toasts.show('info', message);
      this.getEmployees();
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  private getFormData(): Employee{
    return {
      name: this.createForm.value.name,
      phone: this.createForm.value.phone,
      pinCode: this.createForm.value.pinCode
    };
  }

  createSubmit(){
    this.submitted = true;
    if(this.createForm.invalid) return;

    this.modalLoader = true;
    const employee = this.getFormData();
    this.company.createEmployee(employee)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; this.submitted = false}))
    .subscribe(message => {

      this.createForm.reset();
      this.modalService.hide(1);
      this.toasts.show('success', message);
      this.getEmployees();
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  hideModal(){
    this.modalService.hide(1);
  }
}
