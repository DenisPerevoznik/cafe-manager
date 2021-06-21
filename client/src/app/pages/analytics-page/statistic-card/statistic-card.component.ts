import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { AppHelpService } from '@app/shared/services/app-help.service';

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
  @Output() customBtnClick: EventEmitter<void> = new EventEmitter();

  constructor(private helpService: AppHelpService) { }

  ngOnInit(): void {
  }

  get fixPercent(): number{
    return this.helpService.trimAfterDecimalPoint(this.percentage);
  }

  onCustomBtnClick(): void{
    this.customBtnClick.emit();
  }
}
