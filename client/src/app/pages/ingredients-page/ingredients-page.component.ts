import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { Ingredient, IngredientUnitEnum } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import {jsPDF} from 'jspdf';

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
  searchText = '';
  modalLoader;
  ingredients: Ingredient[] = [];
  selectedIngredient: Ingredient;
  unsubscribe: Subject<any> = new Subject();
  isEdit = false;
  createForm: FormGroup;
  unitChanged = false;
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
      // minStock: new FormControl(null, [Validators.required]),
      // consignment: new FormControl(null, [Validators.required]),
      // optional: new FormControl(false)
    });
    this.getIngredients();
  }

  onChangeUnit(): void{
    this.unitChanged = true;
  }

  getIngredients(): void{
    this.loader = true;
    this.company.getIngredients()
    .pipe(takeUntil(this.unsubscribe), finalize(() => { this.loader = false; }))
    .subscribe(ingredients => {this.ingredients = ingredients; });
  }

  onCreateIngredientClick(): void{
    this.isEdit = false;
    this.createForm.reset();
    this.modalService.show(ModalComponent, {
      data: {
        content: this.createModal,
        title: 'Добавление ингредиента'
      }
    });
  }

  removeClick(ingredient): void{
    this.selectedIngredient = ingredient;
    this.modalService.show(ModalComponent, {
      data: {
        title: `Удаление ингредиента (${ingredient.title})`,
        content: this.removeModal
      }
    });
  }

  createDelivery(): void{
    // здесь нужно перенаправлять на страницу оформления поставки
     // с query параметром, который будет говорить о том, что
    // нужно получить нужные недостающие ингредиенты и добавить их в поставку
  }

  removeIngredient(): void{
    this.modalLoader = true;
    this.company.removeIngredient(this.selectedIngredient.id)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; }))
    .subscribe(message => {

      this.modalService.hide(1);
      this.getIngredients();
      this.toasts.show('info', message);
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  editClick(ingredient: Ingredient): void{
    this.selectedIngredient = ingredient;
    this.createForm.patchValue(ingredient);
    this.isEdit = true;

    this.modalService.show(ModalComponent, {
      data: {
        content: this.createModal,
        title: 'Изменение ингредиента'
      }
    });
  }

  private getRequestModel(): Ingredient{
    return {
      unit: this.createForm.value.unit,
      title: this.createForm.value.title,
      consignment: 0,
      minStock: 0,
      // optional: false
      // consignment: this.createForm.value.consignment,
      // minStock: this.createForm.value.minStock,
      // optional: this.createForm.value.optional
    };
  }

  saveIngredientChanges(): void{
    this.submitted = true;
    if (this.createForm.invalid) { return; }

    this.modalLoader = true;
    this.company.updateIngredient(this.getRequestModel(), this.selectedIngredient.id)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; this.submitted = false; }))
    .subscribe(message => {

      this.createForm.reset();
      this.modalService.hide(1);
      this.toasts.show('info', message);
      this.getIngredients();
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  createSubmit(): void{
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }

    this.modalLoader = true;
    this.company.createIngredient(this.getRequestModel())
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; this.submitted = false; }))
    .subscribe(message => {

      this.createForm.reset();
      this.modalService.hide(1);
      this.toasts.show('success', message);
      this.getIngredients();
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  createIngredientsDoc(): void{
    const headers = this.createDocumentHeaders([
      'Товар/Ингредиент',
      'Единица',
      'Кол-во'
    ]);

    const doc = new jsPDF();
    doc.table(1, 1, this.generateDocumentData(), headers, { autoSize: true });
    const currentDate = new Date();
    doc.save(`Закупка ${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}.pdf`);
  }

  private generateDocumentData(): any[] {
    const filteredIngredients = this.ingredients
      .filter(ing => ing.quantity <= ing.minStock);

    const result = [];
    let index = 0;

    for (const ingredient of filteredIngredients) {

      const data = {id: (index + 1).toString(),
        Единица: ingredient.unit, 'Товар/Ингредиент': ingredient.title, 'Кол-во': ingredient.consignment.toString()};
      result.push(Object.assign({}, data));
      index++;
    }
    console.log('RESULT:', result);
    return result;
  }

  private createDocumentHeaders(keys): any[] {
    const result = [];
    for (let i = 0; i < keys.length; i += 1) {
      result.push({
        id: keys[i],
        name: keys[i],
        prompt: keys[i],
        width: 65,
        align: 'center',
        padding: 0
      });
    }
    return result;
  }

  hideModal(): void{
    this.modalService.hide(1);
  }
}
