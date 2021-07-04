import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { Category } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss']
})
export class CategoriesPageComponent implements OnInit, OnDestroy {

  @ViewChild('createModal') createModal;
  @ViewChild('removeModal') removeModal;
  loader;
  submitted;
  modalLoader;
  searchText = '';
  categories: Category[] = [];
  selectedCategoryId: string | number = 0;
  unsubscribe: Subject<any> = new Subject();
  isEdit: boolean = false;
  createForm: FormGroup;
  colors = ['#f44336', '#e91e63', '#673ab7', '#2196f3', '#009688', '#4caf50', '#ff5722', '#607d8b'];
  constructor(private company: CompanyService, private toasts: ToastService,
    private modalService: MDBModalService) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {

    this.createForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      published: new FormControl('1'),
      color: new FormControl(null, [Validators.required])
    });
    this.getCategories();
  }

  getCategories(){
    this.loader = true;
    this.company.getCategories()
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(categories => {this.categories = categories})
  }

  onCreateCategoryClick(){
    this.modalService.show(ModalComponent, {
      data: {
        content: this.createModal,
        title: "Новая категория"
      }
    });
  }

  categoryColorChange(color){
    this.createForm.get('color').patchValue(color);
  }

  removeClick(category: Category){

    if(!category.allowToRemove)
      return;

    this.selectedCategoryId = category.id;
    this.modalService.show(ModalComponent, {
      data: {
        title: `Удаление категории (${this.categories.find(c => c.id === category.id).title})`,
        content: this.removeModal
      }
    });
  }

  removeCategory(){
    this.modalLoader = true;
    this.company.removeCategory(this.selectedCategoryId)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false}))
    .subscribe(message => {

      this.modalService.hide(1);
      this.getCategories();
      this.toasts.show('info', message);
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  editClick(category: Category){
    this.selectedCategoryId = category.id;
    this.createForm.patchValue({...category, published: category.published ? '1' : '0'});
    this.isEdit = true;
    
    this.modalService.show(ModalComponent, {
      data: {
        content: this.createModal,
        title: "Изменение категории"
      }
    });
  }

  saveCategoryChanges(){
    this.submitted = true;
    if(this.createForm.invalid) return;

    this.modalLoader = true;
    const category: Category = {
      color: this.createForm.value.color,
      published: this.createForm.value.published,
      title: this.createForm.value.title
    };
    this.company.updateCategory(category, this.selectedCategoryId)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; this.submitted = false}))
    .subscribe(message => {

      this.createForm.reset();
      this.modalService.hide(1);
      this.toasts.show('info', message);
      this.getCategories();
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }

  createSubmit(){
    this.submitted = true;
    if(this.createForm.invalid) return;

    this.modalLoader = true;
    const category: Category = {
      color: this.createForm.value.color,
      published: this.createForm.value.published,
      title: this.createForm.value.title
    };
    this.company.createCategory(category)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false; this.submitted = false}))
    .subscribe(message => {

      this.createForm.reset();
      this.modalService.hide(1);
      this.toasts.show('success', message);
      this.getCategories();
    }, resp => {
      this.toasts.show('error', resp.error.message);
    });
  }
}
