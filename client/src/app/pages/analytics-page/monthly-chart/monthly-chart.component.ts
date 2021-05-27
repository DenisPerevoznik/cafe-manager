import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MonthlyData } from '@app/shared/interfaces';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-monthly-chart',
  templateUrl: './monthly-chart.component.html',
  styleUrls: ['./monthly-chart.component.scss']
})
export class MonthlyChartComponent implements OnChanges, OnInit {

  @Input() dataSource: MonthlyData;

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май',
  'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  public colors;
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    
    if(changes.dataSource && !!this.dataSource){
      this.barChartData = [
        { data: this.dataSource.revenueArr, label: 'Выручка' },
        { data: this.dataSource.profitArr, label: 'Марж. прибыль' },
        { data: this.dataSource.receiptArr, label: 'Посещаемость' }
      ];
    }
  }

  ngOnInit(): void {
    this.barChartData = [
      { data: [], label: 'Выручка' },
      { data: [], label: 'Марж. прибыль' },
      { data: [], label: 'Посещаемость' }
    ];

    this.colors = [
      {backgroundColor: '#11ca289e'},
      {backgroundColor: '#11A8CA'},
      {backgroundColor: '#FFBC24'}
      // {backgroundColor: '#4883da'},
      // {backgroundColor: '#26415a'},
      // {backgroundColor: '#ffc81b'}
    ];
  }

}
