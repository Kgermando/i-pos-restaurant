import { CurrencyPipe } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../../auth/models/user';
import { ICommandeLine } from '../../../../models/commande_line.model';
import { IPlat } from '../../../../models/plat.model';
import { CommandeLineService } from '../../../commandes-lines/commande-line.service';

@Component({
  selector: 'app-liv-plat-item',
  templateUrl: './liv-plat-item.component.html',
  styleUrl: './liv-plat-item.component.scss'
})
export class LivPlatItemComponent {
  @Input() currentUser!: IUser;
  @Input() item!: IPlat;
  @Input() livraisonId!: number;

  isLoading = false;

  quantity = signal<number>(1); // Initialiser à 1
  qty = signal<number>(1); // A ajouter au panier

  constructor(
    private commaneLineService: CommandeLineService,
    private currencyPipe: CurrencyPipe,
    private toastr: ToastrService
  ) { }


  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }

  onQuantityChange(product: IPlat, newQuantity: number) {
    console.log("prod", product);
    this.qty.set(newQuantity);
  }


  onSubmit(plat: IPlat) {
    this.isLoading = true;
    const body: ICommandeLine = {
      commande_id: 0,
      livraison_id: parseInt(this.livraisonId!.toString()),
      product_id: 0,
      plat_id: plat.ID!,
      quantity: this.qty(),
      code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
    };
    this.commaneLineService.create(body).subscribe(() => {
      this.toastr.success('Plat ajouté dans le panier!', 'Success!');
      this.qty.set(0);
      this.quantity.set(1);
      this.isLoading = false;
    });
  }
}

