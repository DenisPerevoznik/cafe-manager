import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AccountsPageComponent } from './pages/accounts-page/accounts-page.component';
import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';
import { CompaniesPageComponent } from './pages/companies-page/companies-page.component';
import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';
import { ShiftSinglePageComponent } from './pages/shifts-page/shift-single-page/shift-single-page.component';
import { ShiftsPageComponent } from './pages/shifts-page/shifts-page.component';

const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {path: '', redirectTo: '/companies', pathMatch: 'full'},
  {path: 'companies', component: CompaniesPageComponent, canActivate: [AuthGuard]},
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'analytics', pathMatch: 'full'},
      { path: 'analytics', component: AnalyticsPageComponent },
      { path: 'shifts', component: ShiftsPageComponent },
      { path: 'shifts/:id', component: ShiftSinglePageComponent },
      { path: 'expenses', component: ExpensesPageComponent },
      { path: 'accounts', component: AccountsPageComponent },
      { path: '**', redirectTo: '/companies' }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
