import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Ingredient, Product } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

interface IngredientRowModel {
  ingredientId: number;
  usingInOne: number;
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
  costPrice = 0;
  loader = false;
  submitted = false;
  categories: Category[] = [];
  ingredients: Ingredient[] = [];
  selectedIngredients: number[] = [];
  product: Product = null;
  isEdit = false;
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
        this.getProduct(params.id);
      }
      else{

      }
    });
  }

  getProduct(id){
    this.loader = true;
    this.company.getProductById(id)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(product => {
      this.product = product;

      this.selectedIngredients = this.product.ingredients.map(ing => ing.id);
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
      unitPrice: 0
    });
  }
  
  get ingredientsIsValid(): boolean{

    for (const ingRow of this.ingredientsRows) {
      if(!ingRow.ingredientId || !ingRow.usingInOne)
        return false;
    }

    return true;
  }

  onSubmit(){
    this.submitted = true;
    if(this.costPrice < 0 || this.createForm.invalid || (!this.isPurchased 
      && (!this.ingredientsIsValid || !this.ingredientsRows.length))){
      return;
    }
    
    const product: Product = {
      costPrice: this.createForm.value.costPrice,
      isPurchased: this.isPurchased,
      price: this.createForm.value.price,
      published: this.createForm.value.published,
      title: this.createForm.value.title,
      CategoryId: this.createForm.value.category
    };

    const ingredients = this.ingredientsRows.map(it => ({id: it.ingredientId, usingInOne: it.usingInOne}));
    this.company.createProduct(product, ingredients)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(message => {
      
      this.router.navigate(['products']);
      this.toats.show('success', message);
    }, resp => {this.toats.show('error', resp.error.message)});
  }
}
