import { Pipe, PipeTransform } from '@angular/core';
import { IngredientUnitEnum } from '../interfaces';

@Pipe({
  name: 'productUnit'
})
export class ProductUnitPipe implements PipeTransform {

  transform(unit: string): string {
    
    let result = '';
    switch (unit) {
      case IngredientUnitEnum.Kilogram:
        result = 'г.';
        break;

      case IngredientUnitEnum.Liter:
        result = 'мл.';
        break;

      case IngredientUnitEnum.Piece:
        result = 'шт.';
        break;
    }

    return result;
  }

}
