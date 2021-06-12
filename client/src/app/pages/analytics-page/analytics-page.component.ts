import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentStatistic, DailyData, MonthlyData } from '@app/shared/interfaces';
import { AnalyticsService } from '@app/shared/services/analytics.service';
import { AppHelpService } from '@app/shared/services/app-help.service';
import { CompanyService } from '@app/shared/services/company.service';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FinanceData } from './finance-chart/finance-chart.component';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.styles.scss'],
  providers: [DatePipe]
})
export class AnalyticsPageComponent implements OnDestroy, OnInit, AfterViewInit {

  currentUser = {name: 'Denis'};

  financeData: FinanceData = {
    differencePrevMonth: 0,
    averageCheck: {value: 0, difference: 0},
    income: {value: 0, difference: 0},
    costs: {value: 0, difference: 0}
  };

  private unsubscribe: Subject<any> = new Subject<any>();
  public monthlyData: MonthlyData;
  public dailyData: DailyData;
  public monthlyAverage = {profit: 0, revenue: 0, receipts: 0};
  public currentDailyDate;
  public currentStatistic: CurrentStatistic = {
    profit: {value: 0, percent: 0},
    revenue: {value: 0, percent: 0},
    receipts: {value: 0, percent: 0}
  };

  constructor(private analyticsService: AnalyticsService, private helpService: AppHelpService,
    private datePipe: DatePipe, private companyService: CompanyService) { }

  ngAfterViewInit(): void {
    this.getMonthlyData();
    this.getDailyData();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.currentDailyDate = new Date();
    this.analyticsService.getCurrentStatistic()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(response => {this.currentStatistic = response});
  }

  get currentDate(): Date{
    return new Date();
  }

  getMonthlyData(year = null){

    if(!year)
      year = new Date().getFullYear();

    this.analyticsService.getMonthlyAnalytics(year)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(data => {
      this.monthlyData = data;
      this.setMonthlyAverage();
    });
  }

  onDailyDateChange(event){
    this.getDailyData(event.target.value);
  }

  getDailyData(selectedDate = null){

    if(!selectedDate)
      selectedDate = this.datePipe.transform(new Date(), 'yyyy-MM').toString();

    const currentDate = new Date(selectedDate.split('-')[0], parseInt(selectedDate.split('-')[1]) - 1);
    const prevDate = this.datePipe.transform(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1), 'yyyy-MM');

    forkJoin({
      currentMonthData: this.analyticsService.getDailyAnalytics(selectedDate),
      previousMonthData: this.analyticsService.getDailyAnalytics(prevDate),
      currentExpanses: this.companyService.getAllExpanses(new Date()),
      prevExpanses: this.companyService.getAllExpanses(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    })
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(data => {
        this.dailyData = data.currentMonthData;
        this.setFinances(data.currentMonthData, data.previousMonthData, data.currentExpanses, data.prevExpanses);
    });
  }

  private setFinances(currentData: DailyData, prevData: DailyData, currentExp: number[], prevExp: number[]){

    const currentProfit = this.helpService.getSum(currentData.profitArr);
    const prevProfit = this.helpService.getSum(prevData.profitArr);
    const currentReceiptSum = this.helpService.getSum(currentData.receiptArr);
    const prevReceiptSum = this.helpService.getSum(prevData.receiptArr);
    const currentExpSum = this.helpService.getSum(currentExp);
    const prevExpSum = this.helpService.getSum(prevExp);

    const currentAverageCheck = currentReceiptSum == 0
    ? 0
    : this.helpService.trimAfterDecimalPoint(this.helpService.getSum(currentData.revenueArr) / currentReceiptSum);

    const prevAverageCheck = prevReceiptSum == 0 
    ? 0
    : this.helpService.trimAfterDecimalPoint(this.helpService.getSum(prevData.revenueArr) / prevReceiptSum);

    this.financeData = {
      income: {
        value: currentProfit,
        difference: this.helpService.getDifference(prevProfit, currentProfit)
      },
      averageCheck: {
        value: currentAverageCheck,
        difference: this.helpService.getDifference(prevAverageCheck, currentAverageCheck)
      },
      costs: {
        value: currentExpSum,
        difference: this.helpService.getDifference(prevExpSum, currentExpSum)
      },
      differencePrevMonth: 0
    };

    this.financeData.differencePrevMonth = this.helpService.trimAfterDecimalPoint(this.helpService
      .getSum([this.financeData.averageCheck.difference, this.financeData.costs.difference, this.financeData.income.difference]) / 3);
  }

  onMonthlyYearChange(event){
    this.getMonthlyData(event.target.value);
  }

  private setMonthlyAverage(){

    const profitArr = this.monthlyData.profitArr.filter(val => val > 0);
    const revenueArr = this.monthlyData.revenueArr.filter(val => val > 0);
    const receiptsArr = this.monthlyData.receiptArr.filter(val => val > 0);

    const profitSum = profitArr.reduce((acc, val) => acc += val, 0);
    const revenueSum = revenueArr.reduce((acc, val) => acc += val, 0);
    const receiptsSum = receiptsArr.reduce((acc, val) => acc += val, 0);

    const profit = profitArr.length 
    ? this.helpService.trimAfterDecimalPoint(profitSum / profitArr.length )
    : 0;

    const revenue = revenueArr.length 
    ? this.helpService.trimAfterDecimalPoint(revenueSum / revenueArr.length) 
    : 0;

    const receipts = receiptsArr.length 
    ? this.helpService.trimAfterDecimalPoint(receiptsSum / receiptsArr.length) 
    : 0;

    this.monthlyAverage = {
      profit, revenue, receipts
    };
  }
}
