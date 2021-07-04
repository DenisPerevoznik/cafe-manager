import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDecimal'
})
export class ToDecimalPipe implements PipeTransform {

  transform(stringNum: string): number {
    return parseFloat(stringNum);
  }

}
