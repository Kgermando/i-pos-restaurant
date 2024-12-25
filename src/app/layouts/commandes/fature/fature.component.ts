import { Component, Input, OnInit } from '@angular/core';
import { IUser } from '../../../auth/models/user';
import { CurrencyPipe } from '@angular/common';
import { CommandeDbLineService } from '../../commandes-lines/commande-db-line.service';
import { PdfService } from '../../../shared/services/pdf.service';
import { ICommande } from '../../../models/commande.model';
import { ICommandeLine } from '../../../models/commande_line.model';
import { CommandeLineService } from '../../commandes-lines/commande-line.service';

@Component({
  selector: 'app-fature',
  templateUrl: './fature.component.html',
  styleUrl: './fature.component.scss'
})
export class FatureComponent implements OnInit {
  @Input() currentUser!: IUser;
  @Input() commande: ICommande| undefined;
  
  isLoading = false;
  commandeLineList: ICommandeLine[] = [];

  constructor(
    private currencyPipe: CurrencyPipe,
    private commaneLineService: CommandeLineService,
    private pdfService: PdfService,
  ) { }


  ngOnInit(): void {
    this.isLoading = true;
    this.commaneLineService.getAllById(this.commande!.ID!).subscribe((line) => {
      this.commandeLineList = line.data; 
      this.isLoading = false;
    });
  }
 
  generatePdf() {
    this.pdfService.generateInvoice(this.commandeLineList);
  }

  get subtotalTVA(): number {
    return this.commandeLineList.filter((f) => f.Product!.tva === 16).reduce((sum, item) => sum + (item.quantity * item.Product!.prix_vente), 0);
  }

  get subtotalSansTVA(): number {
    return this.commandeLineList.filter((f) => f.Product!.tva !== 16).reduce((sum, item) => sum + (item.quantity * item.Product!.prix_vente), 0);
  }

  get subtotal(): number {
    return this.subtotalSansTVA + this.subtotalTVA;
  }

  get tax(): number {
    return this.subtotalTVA * 0.16; // 16% de TVA
  }

  get total(): number {
    return this.subtotalSansTVA + this.subtotalTVA + this.tax;
  }

 
  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }

}
