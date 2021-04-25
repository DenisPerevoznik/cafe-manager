import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { WorkShift } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { ToastService } from '@app/shared/services/toast.service';
import { MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shifts-page',
  templateUrl: './shifts-page.component.html',
  styleUrls: ['./shifts-page.component.scss']
})
export class ShiftsPageComponent implements OnInit, OnDestroy {

  @ViewChild('monthpicker') monthpicker;
  @ViewChild('confirmRemoveModal') confirmRemoveModal;

  workShiftsData: WorkShift[] = [];
  unsubscribe: Subject<any> = new Subject<any>();
  loader = true;
  constructor(private companyService: CompanyService,
    private toasts: ToastService,
    private modalService: MDBModalService) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.getAllShifts();
  }

  getAllShifts(){
    this.loader = true;
    this.companyService.getWorkShifts()
    .pipe(finalize(() => {this.loader = false}))
    .subscribe(workShifts => {
      this.workShiftsData = <WorkShift[]>workShifts;
      this.monthpicker.nativeElement.value = null;
    });
  }

  getByMonth(event){
    this.loader = true;    
    const value = event.target.value;

    this.companyService.getWorkShiftByDate(value)
    .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
    .subscribe(workShifts => {
      
      this.workShiftsData = workShifts;
    });
  }

  removeShiftClick(shiftId){
    this.modalService.show(ModalComponent, {
      data: {content: this.confirmRemoveModal, 
      confirmMode: true, title: "Подтвердите удаление"}
    }).content.okClick.subscribe(() => {
      this.modalService.hide(1);
      this.companyService.removeWorkShift(shiftId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(response => {
        this.toasts.show('info', response.message);
        this.getAllShifts();
      });
    });
  }
}
