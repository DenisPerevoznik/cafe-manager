import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { Supplier } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-suppliers-page',
  templateUrl: './suppliers-page.component.html',
  styleUrls: ['./suppliers-page.component.scss']
})
export class SuppliersPageComponent implements OnInit, OnDestroy {

  
  @ViewChild('createModal') createModal;
  @ViewChild('removeModal') removeModal;
  loader;
  submitted;
  modalLoader;
  suppliers: Supplier[] = [];
  selectedSupplierId: string | number = 0;
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
      egrpou: new FormControl(null),
      taxpayerNumber: new FormControl(null),
      phone: new FormControl(null, [Validators.required]),
      address: new FormControl(null),
      comment: new FormControl(null)
    });
    this.getSuppliers();
  }

  getSuppliers(){
    this.loader = true;
    this.company.getSuppliers()
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(suppliers => {this.suppliers = suppliers})
  }

  onCreateSupplierClick(){
    this.modalService.show(ModalComponent, {
      data: {
        content: this.createModal,
        title: "Добавление поставщика"
      }
    });
  }

  removeClick(id){
    this.selectedSupplierId = id;
    this.modalService.show(ModalComponent, {
      data: {
        title: `Удаление поставщика "${this.suppliers.find(s => s.id === id).name}"`,
        content: this.removeModal
      }
    });
  }

  removeSupplier(){
    this.modalLoader = true;
    this.company.removeSupplier(this.selectedSupplierId)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false}))
    .subscribe(message => {

      this.modalService.hide(1);
      this.getSuppliers();
      this.toasts.show('info', message);
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  editClick(supplier: Supplier){
    this.selectedSupplierId = supplier.id;
    this.createForm.patchValue(supplier);
    this.isEdit = true;
    
    this.modalService.show(ModalComponent, {
      data: {
        content: this.createModal,
        title: "Изменение поставщика"
      }
    });
  }

  private get requestSupplierModel(): Supplier{
    return {
      name: this.createForm.value.name,
      egrpou: this.createForm.value.egrpou,
      taxpayerNumber: this.createForm.value.taxpayerNumber,
      address: this.createForm.value.address,
      comment: this.createForm.value.comment,
      phone: this.createForm.value.phone,
    }
  }

  saveSupplierChanges(){
    this.submitted = true;
    if(this.createForm.invalid) return;

    this.modalLoader = true;
    this.company.updateSupplier(this.requestSupplierModel, this.selectedSupplierId)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; this.submitted = false}))
    .subscribe(message => {

      this.createForm.reset();
      this.modalService.hide(1);
      this.toasts.show('info', message);
      this.getSuppliers();
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  createSubmit(){
    this.submitted = true;
    if(this.createForm.invalid) return;

    this.modalLoader = true;
    this.company.createSupplier(this.requestSupplierModel)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; this.submitted = false}))
    .subscribe(message => {

      this.createForm.reset();
      this.modalService.hide(1);
      this.toasts.show('success', message);
      this.getSuppliers();
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }
}
