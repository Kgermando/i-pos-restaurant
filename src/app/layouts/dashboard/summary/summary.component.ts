import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IUser } from '../../../auth/models/user';
import { ShortenAmountPipe } from '../../../shared/pipes/shorten-amount.pipe';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  @Input() isLoading!: boolean;
  @Input() currentUser!: IUser;
  @Input() TotalProductStock = 0; 
  @Input() TotalProfitDispos = 0;
  @Input() TotalProfitSorties = 0;
  @Input() TatalValeurProducts = 0;

  constructor(
    private currencyPipe: CurrencyPipe,
    private shortenAmountPipe: ShortenAmountPipe
  ) { }
 

  formatCurrency(price: number, currency: string): string {
    const shortenedPrice = this.shortenAmountPipe.transform(price);
    const numericShortenedPrice = parseFloat(shortenedPrice.replace(/[MK]/, ''));
    const suffix = shortenedPrice.replace(/[0-9.]/g, '');
    const formattedPrice = this.currencyPipe.transform(numericShortenedPrice, currency, 'symbol', '1.2-2', 'fr-FR') || '';

    // Ajouter le suffixe 'K' ou 'M' et la devise 'CDF' à la fin du montant formaté
    return `${formattedPrice}${suffix} CDF`;
  }


}
