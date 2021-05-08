import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(array: any[], searchText: string, searchKey: string): any[] {
    if(!searchKey.trim() || !searchText.trim())
      return array;

    return array.filter(item => item[searchKey].toLowerCase().includes(searchText.toLowerCase()));
  }

}
