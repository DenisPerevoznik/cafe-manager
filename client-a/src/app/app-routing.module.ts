import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AccountsPageComponent } from './pages/accounts-page/accounts-page.component';
import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { CompaniesPageComponent } from './pages/companies-page/companies-page.component';
import { EmployeesPageComponent } from './pages/employees-page/employees-page.component';
import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';
import { IngredientsPageComponent } from './pages/ingredients-page/ingredients-page.component';
import { CreateProductPageComponent } from './pages/products-page/create-product-page/create-product-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
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
      { path: 'categories', component: CategoriesPageComponent },
      { path: 'products', component: ProductsPageComponent },
      { path: 'products/create', component: CreateProductPageComponent },
      { path: 'products/edit/:id', component: CreateProductPageComponent },
      { path: 'ingredients', component: IngredientsPageComponent },
      { path: 'employees', component: EmployeesPageComponent },
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
