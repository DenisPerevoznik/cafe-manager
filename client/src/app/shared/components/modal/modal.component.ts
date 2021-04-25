import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  confirmMode: boolean = false;
  title = '';
  content: TemplateRef<any>;
  okClick: Subject<void> = new Subject<void>();
  constructor(public modalRef: MDBModalRef) { }

  ngOnInit(): void {
  }

  onOkClick(){
    this.okClick.next();
  }
}
