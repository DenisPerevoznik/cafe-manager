export interface User {
  id?: number | string;
  email: string;
}

export interface Company {
  id?: number;
  name: string;
  address: string;
  mainAccount?: number;
  lastSync?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DailyData{

  labels: string[];
  profitArr: number[];
  revenueArr: number[];
  receiptArr: number[];
}

export interface MonthlyData{

  profitArr: number[];
  revenueArr: number[];
  receiptArr: number[];
}

export interface CurrentStatistic{

  revenue: number;
  profit: number;
  receipts: number;
}

export interface WorkShift {
  CompanyId?: number;
  EmployeeId?: number;
  closingBalance: number;
  closingTime: string;
  collection: number;
  createdAt?: Date;
  date: any;
  employeeName: string;
  id?: number;
  openingBalance: number;
  openingTime: string;
  receipts: number;
  revenue: number;
  slaes: Sales[];
  status: boolean;
  updatedAt?: Date;
}

export interface Sales {
  numberOfSales: number;
  productName: string;
  revenue: number;
  unitPrice: number;
}

export interface Expense {
  AccountId?: number | string;
  CompanyId?: number | string;
  // accountTitle: string;
  createdAt?: string;
  description: string;
  expenseAmount: number;
  id?: number | string;
  updatedAt?: string;
}

export interface Account{
  CompanyId?: number;
  balance: number;
  createdAt?: string;
  id?: string | number;
  title: string;
  updatedAt?: string;
}

export interface Category{
  CompanyId?: number;
  id?: string | number;
  title: string;
  published: boolean;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ingredient {
  id?: number;
  title: string;
  price?: number;
  unit: IngredientUnitEnum;
  isUsing?: boolean;
  quantity?: number;
  createdAt?: string;
  usingInOne?: number;
  updatedAt?: string;
  CompanyId?: number;
}

export enum IngredientUnitEnum {
  Kilogram = 'кг.',
  Liter = 'л.',
  Piece = 'шт.'
}

export interface Product {
  id?: number;
  CompanyId?: number;
  title: string;
  price: number;
  published: boolean;
  costPrice: number;
  type?: string;
  ingredients?: Ingredient[],
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  CategoryId?: number;
}

export interface Employee {
  id?: number;
  CompanyId?: number;
  name: string;
  pinCode: number;
  phone: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Supplier{
  id?: number;
  CompanyId?: number;
  name: string;
  egrpou: string;
  taxpayerNumber: string;
  phone: string;
  address: string;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Delivery{
  id?: number;
  CompanyId?: number;
  sum: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
  AccountId?: number;
  SupplierId?: number;
  supplier?: Supplier;
  account?: Account;
}