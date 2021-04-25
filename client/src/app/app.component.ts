import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('toastTemplate') toastTemplate: TemplateRef<any>;
  constructor(private toastService: ToastService) {}

  ngAfterViewInit(): void {
    this.toastService.setTemplate(this.toastTemplate);
  }
}
