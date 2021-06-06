import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Color, Label, MultiDataSet } from 'ng2-charts';

export type FinanceData = {
  differencePrevMonth: number,
  income: {value: number, difference: number},
  costs: {value: number, difference: number},
  averageCheck: {value: number, difference: number}
}

@Component({
  selector: 'app-finance-chart',
  templateUrl: './finance-chart.component.html',
  styleUrls: ['./finance-chart.component.scss']
})
export class FinanceChartComponent implements OnChanges {

  @Input() financesData: FinanceData;
  public doughnutChartLabels: Label[] = ['Доход', 'Расходы', 'Средний чек'];
  public doughnutChartData: MultiDataSet = [
    [0, 0, 0],
  ];

  colors: Color[] = [
    {backgroundColor: ['#4782da', '#f44336']}, //#ff9800
  ];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    
    if(changes.financesData)
      this.doughnutChartData = [[this.financesData.income.value, this.financesData.costs.value, 
        this.financesData.averageCheck.value]];
  }
}
