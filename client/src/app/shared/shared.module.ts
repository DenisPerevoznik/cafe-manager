import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ToastService } from './services/toast.service';
import { HeaderComponent } from './components/header/header.component';
import { MDBBootstrapModule, MDBModalService } from 'angular-bootstrap-md';
import { RouterModule } from '@angular/router';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { ModalComponent } from './components/modal/modal.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { CheckAccountPipe } from './pipes/check-account.pipe';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { SearchPipe } from './pipes/search.pipe';
import { AppHelpService } from './services/app-help.service';

@NgModule({
  imports: [
    HttpClientModule,
    RouterModule,
    CommonModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot({position: ['top', 'right'], pauseOnHover: true, timeOut: 5000}),
    MDBBootstrapModule.forRoot(),
  ],
  providers: [ToastService, MDBModalService, AppHelpService],
  declarations: [HeaderComponent, PageLoaderComponent, ModalComponent, NoDataComponent, CheckAccountPipe, ColorPickerComponent, SearchPipe],
  exports: [
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule,
    MDBBootstrapModule,
    HeaderComponent,
    PageLoaderComponent,
    CheckAccountPipe,
    NoDataComponent,
    ModalComponent,
    ColorPickerComponent,
    SearchPipe
  ],
})
export class SharedModule {}
