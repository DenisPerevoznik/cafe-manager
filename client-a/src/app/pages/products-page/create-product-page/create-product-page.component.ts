import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-product-page',
  templateUrl: './create-product-page.component.html',
  styleUrls: ['./create-product-page.component.scss']
})
export class CreateProductPageComponent implements OnInit, OnDestroy {

  unsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.route.params
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(params => {
      
      if(params.id){ // isEdit

      }
      else{

      }
    });
  }

}
