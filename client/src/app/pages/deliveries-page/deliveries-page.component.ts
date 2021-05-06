import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { Delivery } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-deliveries-page',
  templateUrl: './deliveries-page.component.html',
  styleUrls: ['./deliveries-page.component.scss']
})
export class DeliveriesPageComponent implements OnInit {

  @ViewChild('removeModal') removeModal;
  loader;
  submitted;
  modalLoader;
  currentDelivery: Delivery = null;
  accounts: Account[] = [];
  deliveries: Delivery[] = [];
  selectedDelivery: Delivery;
  unsubscribe: Subject<any> = new Subject();
  constructor(private company: CompanyService, private toasts: ToastService,
    private modalService: MDBModalService) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.getDeliveries();
  }

  getDeliveries(){
    this.loader = true;
    this.company.getDeliveries()
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(deliveries => {this.deliveries = deliveries})
  }

  removeClick(delivery){
    this.selectedDelivery = delivery;
    this.modalService.show(ModalComponent, {
      data: {
        title: `Удаление поставки`,
        content: this.removeModal
      }
    });
  }

  removeDelivery(){
    this.modalLoader = true;
    this.company.removeDelivery(this.selectedDelivery.id)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false}))
    .subscribe(message => {

      this.modalService.hide(1);
      this.getDeliveries();
      this.toasts.show('info', message);
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }
}
