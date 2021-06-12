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

  public getSum(array: number[]): number{
    return array.reduce((acc, val) => acc += val, 0);
  }

  public getDifference(prevNumber: number, currentNumber: number, countNumberAfterDecimal: number = 2): number{

    const a = prevNumber >= currentNumber ? currentNumber : prevNumber;
    const b = prevNumber >= currentNumber ? prevNumber : currentNumber;


    const num = b - a;
    if(num == 0) return 0;

    if(a == 0) return 0;

    return this.trimAfterDecimalPoint(num / a * 100, countNumberAfterDecimal);
  }
}
