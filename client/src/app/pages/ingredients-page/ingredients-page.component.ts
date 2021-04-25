import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { Ingredient } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ingredients-page',
  templateUrl: './ingredients-page.component.html',
  styleUrls: ['./ingredients-page.component.scss']
})
export class IngredientsPageComponent implements OnInit, OnDestroy {

  @ViewChild('createModal') createModal;
  @ViewChild('removeModal') removeModal;
  loader;
  submitted;
  modalLoader;
  ingredients: Ingredient[] = [];
  selectedIngredient: Ingredient;
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
      title: new FormControl(null, [Validators.required]),
      unit: new FormControl(null, [Validators.required]),
    });
    this.getIngredients();
  }

  getIngredients(){
    this.loader = true;
    this.company.getIngredients()
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(ingredients => {this.ingredients = ingredients})
  }

  onCreateIngredientClick(){
    this.isEdit = false;
    this.createForm.reset();
    this.modalService.show(ModalComponent, {
      data: {
        content: this.createModal,
        title: "Добавление ингредиента"
      }
    });
  }

  removeClick(ingredient){
    this.selectedIngredient = ingredient;
    this.modalService.show(ModalComponent, {
      data: {
        title: `Удаление ингредиента (${ingredient.title})`,
        content: this.removeModal
      }
    });
  }

  removeIngredient(){
    this.modalLoader = true;
    this.company.removeIngredient(this.selectedIngredient.id)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false}))
    .subscribe(message => {

      this.modalService.hide(1);
      this.getIngredients();
      this.toasts.show('info', message);
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  editClick(ingredient: Ingredient){
    this.selectedIngredient = ingredient;
    this.createForm.patchValue(ingredient);
    this.isEdit = true;
    
    this.modalService.show(ModalComponent, {
      data: {
        content: this.createModal,
        title: "Изменение ингредиента"
      }
    });
  }

  saveIngredientChanges(){
    this.submitted = true;
    if(this.createForm.invalid) return;

    this.modalLoader = true;
    const ingredient: Ingredient = {
      unit: this.createForm.value.unit,
      title: this.createForm.value.title,
    };
    this.company.updateIngredient(ingredient, this.selectedIngredient.id)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; this.submitted = false}))
    .subscribe(message => {

      this.createForm.reset();
      this.modalService.hide(1);
      this.toasts.show('info', message);
      this.getIngredients();
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  createSubmit(){
    this.submitted = true;
    if(this.createForm.invalid) return;

    this.modalLoader = true;
    const ingredient: Ingredient = {
      unit: this.createForm.value.unit,
      title: this.createForm.value.title
    };
    this.company.createIngredient(ingredient)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; this.submitted = false}))
    .subscribe(message => {

      this.createForm.reset();
      this.modalService.hide(1);
      this.toasts.show('success', message);
      this.getIngredients();
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  hideModal(){
    this.modalService.hide(1);
  }
}
