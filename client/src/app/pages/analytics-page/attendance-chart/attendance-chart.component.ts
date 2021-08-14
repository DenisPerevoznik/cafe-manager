import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartDataSets} from 'chart.js';
import {Color} from 'ng2-charts';
import {AttendanceData} from '@app/shared/interfaces';

@Component({
  selector: 'app-attendance-chart',
  templateUrl: './attendance-chart.component.html',
  styleUrls: ['./attendance-chart.component.css']
})
export class AttendanceChartComponent implements OnInit, OnChanges {

  @Input() dataSource: AttendanceData;

  public lineChartData: ChartDataSets[];

  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(210, 25, 110, 0)',
      borderColor: 'rgba(210, 25, 110, 0.9)',
      pointHitRadius: 2,
    }
  ];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.dataSource && !!this.dataSource && !!this.dataSource.receiptArr){
      this.lineChartData = [
        { data: this.dataSource.receiptArr, label: 'Посещаемость', lineTension: 0 },
      ];
    }
  }

  ngOnInit(): void {
    this.lineChartData = [
      { data: [], label: 'Посещаемость', lineTension: 0 },
    ];
  }
}
