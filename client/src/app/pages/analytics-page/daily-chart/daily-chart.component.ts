import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DailyData } from '@app/shared/interfaces';
import { ChartDataSets } from 'chart.js';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-daily-chart',
  templateUrl: './daily-chart.component.html',
  styleUrls: ['./daily-chart.component.scss']
})
export class DailyChartComponent implements OnChanges, OnInit {

  @Input() dataSource: DailyData;

  public lineChartData: ChartDataSets[];

  public lineChartColors: Color[] = [
    {
      borderColor: 'rgb(72, 131, 218)',
      backgroundColor: 'rgba(72, 131, 218, 0.05)',
      pointHitRadius: 2
    },
    {
      borderColor: 'rgba(158, 158, 158, 0.9)',
      backgroundColor: 'rgba(28, 56, 83, 0.05)',
      borderDash: [12, 5],
      pointHitRadius: 2
    },
    {
      backgroundColor: 'rgba(210, 25, 110, 0)',
      borderColor: 'rgba(210, 25, 110, 0.9)',
      pointHitRadius: 2,
    }
  ];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.dataSource && !!this.dataSource){
      this.lineChartData = [
        { data: this.dataSource.revenueArr, label: 'Выручка' },
        { data: this.dataSource.profitArr, label: 'Марж. прибыль' },
        { data: this.dataSource.receiptArr, label: 'Посещаемость', lineTension: 0 },
      ];
    }
  }

  ngOnInit(): void {
    this.lineChartData = [
      { data: [], label: 'Выручка' },
      { data: [], label: 'Марж. прибыль' },
      { data: [], label: 'Посещаемость', lineTension: 0 },
    ];
  }

}
