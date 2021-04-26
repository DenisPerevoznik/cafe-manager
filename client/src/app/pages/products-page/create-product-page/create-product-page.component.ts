import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Ingredient, IngredientUnitEnum, Product } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

interface IngredientRowModel {
  ingredientId: number;
  usingInOne: number;
  unitPrice: number;
  costPrice: number;
  unit: string;
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
  costPrice = 0;
  loader = false;
  submitted = false;
  categories: Category[] = [];
  ingredients: Ingredient[] = [];
  selectedIngredients: number[] = [];
  product: Product = null;
  isEdit = false;
  editProductId;
  createForm: FormGroup;
  ingredientsRows: IngredientRowModel[] = [];
  constructor(private route: ActivatedRoute, private company: CompanyService,
    private router: Router, private toats: ToastService) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.createForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
      published: new FormControl('1')
    });
    this.getData();

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
        this.isEdit = true;
        this.editProductId = params.id;
      }
    });
  }

  getProduct(id){
    this.loader = true;
    this.company.getProductById(id)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(product => {
      this.product = product;

      this.createForm.patchValue(product);
      this.createForm.get('category').patchValue(product.CategoryId);
      this.createForm.get('published').patchValue(product.published ? '1' : '0');

      this.ingredientsRows = this.product.ingredients.map(ing => {
        const costPrice = (ing.price * ing.usingInOne) / 1000;
        const unitPrice = ing.price / 1000;
        return {costPrice, ingredientId: ing.id, unit: this.getUnit(ing.unit), unitPrice, usingInOne: ing.usingInOne};
      });
      this.selectedIngredients = this.product.ingredients.map(ing => ing.id);
      this.costPrice = product.costPrice;
    });
  }

  getData(){
    this.loader = true;

    forkJoin({
      categories: this.company.getCategories(),
      ingredients: this.company.getIngredients()
    })
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(data => {
      this.categories = data.categories;
      this.ingredients = data.ingredients;

      if(this.isEdit){
        this.getProduct(this.editProductId);
      }
    });
  }

  removeIngredient(index){
    this.ingredientsRows.splice(index, 1);
    this.updateSelectedIngredient();
  }

  updateSelectedIngredient(){
    this.selectedIngredients = this.ingredientsRows
    .filter(row => row.ingredientId)
    .map(row => row.ingredientId);
    this.ingredients = [...this.ingredients];
  }

  addIngredient(){
    this.ingredientsRows.push({
      costPrice: 0,
      ingredientId: null,
      usingInOne: 0,
      unitPrice: 0,
      unit: ''
    });
  }
  
  get ingredientsIsValid(): boolean{

    for (const ingRow of this.ingredientsRows) {
      if(!ingRow.ingredientId || !ingRow.usingInOne)
        return false;
    }

    return true;
  }

  onSelectIngredient(rowIngredient: IngredientRowModel){

    const ingredient = this.ingredients.find(ing => ing.id == rowIngredient.ingredientId);

    rowIngredient.unitPrice = ingredient.price / 1000;
    rowIngredient.unit = this.getUnit(ingredient.unit);
    this.updateSelectedIngredient();
    this.updateCostPrice();
  }

  private getUnit(unit: IngredientUnitEnum): string{

    let result = '';
    switch (unit) {
      case IngredientUnitEnum.Kilogram:
        result = 'г.';
        break;

      case IngredientUnitEnum.Liter:
        result = 'мл.';
        break;

      case IngredientUnitEnum.Piece:
        result = 'шт.';
        break;
    }

    return result;
  }

  updateCostPrice(){
    this.costPrice = this.ingredientsRows.reduce((acc, ing) => acc += ing.costPrice, 0);
  }

  usedInOneChnage(index){

    const row = this.ingredientsRows[index];
    const value = row.usingInOne;
    const ingredient = this.ingredients.find(ing => ing.id == row.ingredientId);

    row.unitPrice = ingredient.price / 1000;
    row.costPrice = (ingredient.price * value) / 1000;
    this.updateCostPrice();
  }

  onSubmit(){
    this.submitted = true;
    if(this.costPrice < 0 || this.createForm.invalid || (!this.isPurchased 
      && (!this.ingredientsIsValid || !this.ingredientsRows.length))){
      return;
    }
    
    this.loader = true;
    const product: Product = {
      costPrice: this.costPrice,
      isPurchased: this.isPurchased,
      price: this.createForm.value.price,
      published: this.createForm.value.published,
      title: this.createForm.value.title,
      CategoryId: this.createForm.value.category
    };

    const ingredients = this.ingredientsRows.map(it => ({id: it.ingredientId, usingInOne: it.usingInOne}));
    
    if(this.isEdit){
      this.company.updateProduct(product, this.editProductId, ingredients)
      .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
      .subscribe(message => {this.successExit(message)}, resp => {this.toats.show('error', resp.error.message)});
      return;
    }
    this.company.createProduct(product, ingredients)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(message => {this.successExit(message)}, resp => {this.toats.show('error', resp.error.message)});
  }

  private successExit(message){
    this.router.navigate(['/dashboard/products']);
    this.toats.show('success', message);
  }
}
