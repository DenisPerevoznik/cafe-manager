import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { WorkShift } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shift-single-page',
  templateUrl: './shift-single-page.component.html',
  styleUrls: ['./shift-single-page.component.scss']
})
export class ShiftSinglePageComponent implements OnDestroy, OnInit, AfterViewInit {

  @ViewChild('conflictModalContent') modalContent;
  @ViewChild('datepicker') datePicker;
  selectedShift: WorkShift = null;
  loader: boolean;
  unsubscribe: Subject<any> = new Subject<any>();
  selectedDate: Date;
  workShiftsByDate: WorkShift[] = [];
  private oldShift: WorkShift = null;
  private previousDateValue;
  private previousDateArray = [];
  private dateSelected: boolean = true;

  constructor(private route: ActivatedRoute, private toasts: ToastService,
    private companyService: CompanyService, private router: Router, 
    private modalService: MDBModalService, private cd: ChangeDetectorRef) { }
  
   ngAfterViewInit(): void {

    this.route.params
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(params => {

      this.companyService.getWorkShifts(params.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((shift: WorkShift) => {

        this.companyService.getWorkShiftByDate(shift.date.dbValue)
        .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
        .subscribe(workShifts => {
          this.workShiftsByDate = workShifts;
          this.selectedDate = new Date(shift.date.dbValue);
        });

        this.selectedShift = shift;
        this.previousDateValue = shift.date.dbValue;
        this.datePicker.nativeElement.value = shift.date.dbValue;
        this.datePicker.nativeElement.dataset.prev = shift.date.dbValue;
        this.cd.detectChanges();
      }, () => {
        this.toasts.show('error', "Не удалось загрузить смену. Повторите попытку");
        this.router.navigate(['dashboard/shifts']);
      })
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.loader = true;
    this.modalService.closed
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(() => {
      this.loader = false;
      if(!this.selectedShift){
        this.selectedShift = this.oldShift;
        this.workShiftsByDate = this.previousDateArray;
      }
      if(!this.dateSelected){
        this.workShiftsByDate = this.previousDateArray;
        this.dateSelected = false;
      }

      this.datePicker.nativeElement.value = this.previousDateValue;
      this.cd.detectChanges();
    })
  }

  onDateChange(event){
    this.previousDateValue = this.datePicker.nativeElement.dataset.prev;
    const value = event.target.value;
    this.selectedDate = new Date(value);
    this.loader = true;
    this.companyService.getWorkShiftByDate(value)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(workShifts => {
      
      this.previousDateArray = this.workShiftsByDate;
      this.workShiftsByDate = workShifts;

      if(workShifts.length > 1){
        this.loader = true;
        this.oldShift = this.selectedShift;
        this.selectedShift = null;
        this.modalService.show(ModalComponent, {
          data: {
            title: "Выберите смену",
            content: this.modalContent
          }
        });
      }
      else if(workShifts.length === 1){
        this.selectedShift = workShifts[0];
        this.loader = false;
      }
      else{
        this.loader = false;
        this.selectedShift = null;
      }
    });

    this.datePicker.nativeElement.dataset.prev = event.target.value;
  }

  moreShiftsClick(){
    this.modalService.show(ModalComponent, {
      data: {
        title: "Выберите смену",
        content: this.modalContent
      }
    });
  }

  selectShiftFromConflict(shift: WorkShift){
    this.dateSelected = true;
    this.selectedShift = shift;
    this.modalService.hide(1);
  }
}
