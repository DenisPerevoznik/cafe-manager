import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentStatistic, DailyData, MonthlyData } from '@app/shared/interfaces';
import { AnalyticsService } from '@app/shared/services/analytics.service';
import { AppHelpService } from '@app/shared/services/app-help.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.styles.scss']
})
export class AnalyticsPageComponent implements OnDestroy, OnInit, AfterViewInit {

  currentUser = {name: 'Denis'};
  elements: any = [
    {first: 'Доход', last: '1254', handle: '+35%'},
    {first: 'Расходы', last: '520', handle: '-12%'},
    {first: 'Зарплаты', last: '1050', handle: '+46%'},
    {first: 'Средний чек', last: '1020', handle: '+24%'},
  ];

  private unsubscribe: Subject<any> = new Subject<any>();
  public dailyData$;
  public monthlyData: MonthlyData;
  public monthlyAverage = {profit: 0, revenue: 0, receipts: 0};
  public currentDailyDate;
  public currentStatistic: CurrentStatistic = {
    profit: {value: 0, percent: 0},
    revenue: {value: 0, percent: 0},
    receipts: {value: 0, percent: 0}
  };

  constructor(private analyticsService: AnalyticsService, private helpService: AppHelpService) { }

  ngAfterViewInit(): void {
    this.getMonthlyData();
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
    this.dailyData$ = this.analyticsService.getDailyAnalytics(event.target.value);
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
