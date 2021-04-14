import { Component, OnInit } from '@angular/core';
import { Category } from '@app/shared/interfaces';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss']
})
export class CategoriesPageComponent implements OnInit {

  loader = false;
  categories: Category[] = [];
  constructor() { }

  ngOnInit(): void {
  }


  onCreateCategoryClick(){}
}
