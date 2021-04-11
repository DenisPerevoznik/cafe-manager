import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentStatistic, DailyData, MonthlyData } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient) { }

  public getDailyAnalytics(date: string): Observable<DailyData>{

    return this.http.post<DailyData>(`/api/analytics/daily`, {yearAndMonth: date});
  }

  public getMonthlyAnalytics(year: string | number): Observable<MonthlyData>{

    return this.http.post<MonthlyData>('/api/analytics/monthly', {year});
  }

  public getCurrentStatistic(): Observable<CurrentStatistic>{
    return this.http.post<CurrentStatistic>('/api/analytics/now', {});
  }
}
