import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentStatistic, DailyData } from '@app/shared/interfaces';
import { AnalyticsService } from '@app/shared/services/analytics.service';
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
    {first: 'Доходы', last: '1254', handle: '+35%'},
    {first: 'Расходы', last: '520', handle: '-12%'},
    {first: 'Зарплаты', last: '1050', handle: '+46%'},
    {first: 'Средний чек', last: '1020', handle: '+24%'},
  ];

  headElements = ['Название', 'Значение', 'Разница'];

  private unsubscribe: Subject<any> = new Subject<any>();
  public dailyData$;
  public monthlyData$;
  public currentDailyDate;
  public currentStatistic: CurrentStatistic = {receipts: 0, revenue: 0, profit: 0};

  constructor(private analyticsService: AnalyticsService) { }

  ngAfterViewInit(): void {
    this.monthlyData$ = this.analyticsService.getMonthlyAnalytics(new Date().getFullYear());
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

  onDailyDateChange(event){
    this.dailyData$ = this.analyticsService.getDailyAnalytics(event.target.value);
  }

  onMonthlyYearChange(event){
    this.monthlyData$ = this.analyticsService.getMonthlyAnalytics(event.target.value);
  }
}
