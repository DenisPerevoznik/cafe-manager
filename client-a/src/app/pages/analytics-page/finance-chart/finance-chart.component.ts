import { Component, OnInit } from '@angular/core';
import { Color, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-finance-chart',
  templateUrl: './finance-chart.component.html',
  styleUrls: ['./finance-chart.component.scss']
})
export class FinanceChartComponent implements OnInit {

  public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales', 'kkk'];
  public doughnutChartData: MultiDataSet = [
    [350, 450, 100, 50],
  ];

  colors: Color[] = [
    {backgroundColor: ['#4782da', '#f44336', '#ff9800'],},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
