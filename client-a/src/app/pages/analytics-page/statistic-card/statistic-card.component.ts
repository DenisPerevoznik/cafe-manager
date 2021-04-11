import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistic-card',
  templateUrl: './statistic-card.component.html',
  styleUrls: ['./statistic-card.component.scss']
})
export class StatisticCardComponent implements OnInit {

  @Input() iconName = 'sentiment_satisfied_alt';
  @Input() title = '';
  @Input() value = '';
  @Input() percentage;
  @Input() isDate = false;
  @Input() reversColor = false;
  @Input() showButton = false;
  @Input() btnIcon;
  @Input() btnText = '';

  constructor() { }

  ngOnInit(): void {
  }

}
