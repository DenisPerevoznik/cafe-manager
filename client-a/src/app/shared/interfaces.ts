export interface User {
  id?: number | string;
  email: string;
}

export interface Company {
  id?: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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
  CompanyId: number;
  EmployeeId: number;
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
  AccountId: number | string;
  CompanyId: number | string;
  accountTitle: string;
  createdAt?: string;
  description: string;
  expenseAmount: number;
  id?: number | string;
  updatedAt?: string;
}

export interface Account{
  CompanyId: number;
  balance: number;
  createdAt?: string;
  id?: string | number;
  title: string;
  type: string;
  updatedAt?: string;
}