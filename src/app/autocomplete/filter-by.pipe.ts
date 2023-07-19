import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../data.models';

@Pipe({ name: 'filterBy' })
export class FilterByPipe implements PipeTransform {
  transform(categories: Category[], input: string): Category[] {
    return categories.filter(category => category.name.toLowerCase().includes(input.toLowerCase()));
  }
}
