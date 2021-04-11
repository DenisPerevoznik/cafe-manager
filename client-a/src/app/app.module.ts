import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './auth/auth.service';
import { CompaniesPageComponent } from './pages/companies-page/companies-page.component';
import { SidebarModule } from 'ng-sidebar';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainInterceptor } from './shared/main.interceptor';
import { StoreModule } from '@ngrx/store';
import { appReducers } from './store/reducers/app.reducers';
import { StatisticCardComponent } from './pages/analytics-page/statistic-card/statistic-card.component';
import { ChartsModule } from 'ng2-charts';
import { DailyChartComponent } from './pages/analytics-page/daily-chart/daily-chart.component';
import { FinanceChartComponent } from './pages/analytics-page/finance-chart/finance-chart.component';
import { MonthlyChartComponent } from './pages/analytics-page/monthly-chart/monthly-chart.component';
import { ShiftsPageComponent } from './pages/shifts-page/shifts-page.component';
import { ShiftSinglePageComponent } from './pages/shifts-page/shift-single-page/shift-single-page.component';
import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';
import { AccountsPageComponent } from './pages/accounts-page/accounts-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    AnalyticsPageComponent,
    SignInComponent,
    CompaniesPageComponent,
    StatisticCardComponent,
    DailyChartComponent,
    FinanceChartComponent,
    MonthlyChartComponent,
    ShiftsPageComponent,
    ShiftSinglePageComponent,
    ExpensesPageComponent,
    AccountsPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    SidebarModule.forRoot(),
    StoreModule.forRoot(appReducers)
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}