import { Pipe, PipeTransform } from '@angular/core';
import { Ingredient } from '@app/shared/interfaces';

@Pipe({
  name: 'ingredientsFilter'
})
export class IngredientsFilterPipe implements PipeTransform {

  transform(ingredients: Ingredient[], excludeIds: number[], selectedId: number): Ingredient[] {
    return ingredients.filter(ing => !excludeIds.find(id => id == ing.id)
      || (selectedId && ing.id == selectedId));
  }

}
