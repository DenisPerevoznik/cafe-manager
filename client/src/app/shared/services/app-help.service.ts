import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppHelpService {

  constructor() { }

  public trimAfterDecimalPoint(digit: number, countNumbers: number = 2): number{
    const strNum = digit.toString();
    let symbol = '.';
    if(strNum.includes(',')){
      symbol = ',';
    }
    else if (strNum.includes('.')){
      symbol = '.';
    }
    else{
      return digit;
    }

    const splitted = strNum.split(symbol);
    return parseFloat(`${splitted[0]}.${splitted[1].substr(0, countNumbers)}`);
  }
}
