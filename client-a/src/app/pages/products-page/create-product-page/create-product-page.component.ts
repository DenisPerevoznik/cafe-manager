import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface IngredientRowModel {
  ingredientId: number;
  specificConsumption: number;
  unitPrice: number;
  costPrice: number;
}

@Component({
  selector: 'app-create-product-page',
  templateUrl: './create-product-page.component.html',
  styleUrls: ['./create-product-page.component.scss']
})
export class CreateProductPageComponent implements OnInit, OnDestroy {

  unsubscribe: Subject<void> = new Subject();
  pageTitle = '';
  isPurchased = false;
  categories: Category[] = [];
  ingredientsRows: IngredientRowModel[] = [];
  constructor(private route: ActivatedRoute, private company: CompanyService) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {

    // this.ingredientsRows = [
    //   {costPrice: 50, ingredientId: 1, specificConsumption: 1, unitPrice: 10},
    //   {costPrice: 50, ingredientId: 1, specificConsumption: 1, unitPrice: 10},
    //   {costPrice: 50, ingredientId: 1, specificConsumption: 1, unitPrice: 10},
    //   {costPrice: 50, ingredientId: 1, specificConsumption: 1, unitPrice: 10}
    // ]
    this.getCategories();

    this.route.queryParams
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(params => {

      if('isPurchased' in params){
        this.isPurchased = params.isPurchased == 'true' ? true : false;
      }
      this.pageTitle = this.isPurchased ? 'Добавление товара' : 'Создание тех карты';
    })

    this.route.params
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(params => {
      if(params.id){ // isEdit

      }
      else{

      }
    });
  }

  getCategories(){
    this.company.getCategories()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(categories => {this.categories = categories})
  }
}
