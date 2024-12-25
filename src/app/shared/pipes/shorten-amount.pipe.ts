import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenAmount'
})
export class ShortenAmountPipe implements PipeTransform {

  transform(value: number): string {
    if (value >= 1000 && value < 1000000) {
      return (value / 1000).toFixed(1) + 'k';
    } else if (value >= 1000000 && value < 1000000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B';
    } else {
      return value.toString();
    }
  }

}
