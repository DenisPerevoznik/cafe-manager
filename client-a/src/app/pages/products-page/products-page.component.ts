import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { Product } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {

  @ViewChild('removeModal') removeModal;
  loader;
  submitted;
  modalLoader;
  products: Product[] = [];
  selectedProduct: Product;
  unsubscribe: Subject<any> = new Subject();
  constructor(private company: CompanyService, private toasts: ToastService,
    private modalService: MDBModalService) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(){
    this.loader = true;
    this.company.getProducts()
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(products => {this.products = products})
  }

  removeClick(product){
    this.selectedProduct = product;
    this.modalService.show(ModalComponent, {
      data: {
        title: `Удаление продукта (${product.title})`,
        content: this.removeModal
      }
    });
  }

  getProductInfoClick(product: Product){}

  removeProduct(){
    this.modalLoader = true;
    this.company.removeProduct(this.selectedProduct.id)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false}))
    .subscribe(message => {

      this.modalService.hide(1);
      this.getProducts();
      this.toasts.show('info', message);
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }
}
