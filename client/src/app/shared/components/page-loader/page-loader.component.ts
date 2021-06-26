import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss']
})
export class PageLoaderComponent implements OnInit, OnChanges {

  @Input() show: boolean = false;
  @Input() subPage: boolean = false;

  // private phrases = ['Спасибо, что используете Sleam ❤️', 'Улыбнись 🙂', 'Загружаем 🧐',
  //   'Хорошо поработать 💻', 'Еще немного 😅', 'Загружаем 🧐', 'Удачи 🖤'];
  
  private phrases = ['Еще немного 🙂', 'Загружаем 🧐'];

  public generatedIndex = 0;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    
    if(changes.show){
      this.generatedIndex = Math.floor(0 + Math.random() * (this.phrases.length - 0));
    }
  }

  ngOnInit(): void {
  }
}
