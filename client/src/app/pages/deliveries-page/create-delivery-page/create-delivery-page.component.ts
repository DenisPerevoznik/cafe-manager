import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account, Delivery, Ingredient, IngredientUnitEnum, Supplier } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

interface DeliveryRowModel{
  ingredientId: number;
  unit: IngredientUnitEnum;
  quantity: number;
  price: number;
  sum: number;
}

@Component({
  selector: 'app-create-delivery-page',
  templateUrl: './create-delivery-page.component.html',
  styleUrls: ['./create-delivery-page.component.scss']
})
export class CreateDeliveryPageComponent implements OnInit, OnDestroy {

  unsubscribe: Subject<void> = new Subject();
  pageTitle = '';
  isPurchased = false;
  totalSum = 0;
  loader = false;
  submitted = false;
  accounts: Account[] = [];
  suppliers: Supplier[] = [];
  ingredients: Ingredient[] = [];
  selectedIngredients: number[] = [];
  createForm: FormGroup;
  deliveryRows: DeliveryRowModel[] = [];
  constructor(private route: ActivatedRoute, private company: CompanyService,
    private router: Router, private toats: ToastService) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.createForm = new FormGroup({
      supplier: new FormControl(null, [Validators.required]),
      account: new FormControl(null, [Validators.required]),
      comment: new FormControl(null),
    });
    this.getData();
  }

  getData(){
    this.loader = true;

    forkJoin({
      accounts: this.company.getAccounts(),
      ingredients: this.company.getIngredients()
    })
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(data => {
      this.accounts = data.accounts;
      this.ingredients = data.ingredients;
    });
  }

  removeDeliveryItem(index){
    this.deliveryRows.splice(index, 1);
    this.updateSelectedIngredient();
    this.updateTotalSum();
  }

  updateSelectedIngredient(){
    this.selectedIngredients = this.deliveryRows
    .filter(row => row.ingredientId)
    .map(row => row.ingredientId);
    this.ingredients = [...this.ingredients];
  }

  addDeliveryItem(){
    this.deliveryRows.push({
      ingredientId: null,
      price: 0,
      quantity: 0,
      sum: 0,
      unit: null
    });
  }
  
  get deliveriesIsValid(): boolean{

    for (const dRow of this.deliveryRows) {
      if(!dRow.ingredientId || !(dRow.quantity >= 0) || !(dRow.price >= 0) || !(dRow.sum >= 0))
        return false;
    }

    return true;
  }

  onSelectIngredient(rowItem: DeliveryRowModel){

    const ingredient = this.ingredients.find(ing => ing.id == rowItem.ingredientId);

    rowItem.unit = ingredient.unit;
    this.updateSelectedIngredient();
    this.updateTotalSum();
  }

  updateTotalSum(){
    this.totalSum = this.deliveryRows.reduce((acc, ing) => acc += ing.sum, 0);
  }

  onChangePriceOrQuantity(event, index, isPriceChanged = true){
    const row = this.deliveryRows[index];
    const price = isPriceChanged ? event.target.value : row.price;
    row.sum = price * row.quantity;
    this.updateTotalSum();
  }

  onChangeSum(event, index){
    const sum = event.target.value;
    const row = this.deliveryRows[index];
    row.price = this.trimAfterDecimalPoint(sum / row.quantity);
    this.updateTotalSum();
  }

  private trimAfterDecimalPoint(digit: number): number{
    const strNum = digit.toString();
    let symbol = '.';
    if(strNum.includes(',')){
      symbol = ',';
    }
    else if (strNum.includes('.')){
      symbol = '.';
    }
    else{
      return digit;
    }

    const splitted = strNum.split(symbol);
    return parseFloat(`${splitted[0]}.${splitted[1].substr(0, 2)}`);
  }

  onSubmit(){
    this.submitted = true;
    if(this.createForm.invalid || !this.deliveriesIsValid || !this.deliveryRows.length){
      return;
    }
    
    this.loader = true;
    const delivery: Delivery = {
      comment: this.createForm.value.comment,
      sum: this.totalSum,
      AccountId: this.createForm.value.account,
      SupplierId: this.createForm.value.supplier,
    };

    const ingredients = this.deliveryRows.map(it => ({id: it.ingredientId, quantity: it.quantity, sum: it.sum, unitPrice: it.price}));

    this.company.createDelivery(delivery, ingredients)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(message => {
      this.router.navigate(['/dashboard/deliveries']);
      this.toats.show('success', message);
    }, resp => {this.toats.show('error', resp.error.message)});
  }
}
