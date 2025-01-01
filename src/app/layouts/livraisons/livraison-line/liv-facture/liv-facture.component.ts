import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../../auth/models/user';
import { ICommandeLine } from '../../../../models/commande_line.model';
import { CommandeLineService } from '../../../commandes-lines/commande-line.service';
import { ILivraison } from '../../../../models/livraison.model';
import { LivraisonService } from '../../livraison.service';

@Component({
  selector: 'app-liv-facture',
  templateUrl: './liv-facture.component.html',
  styleUrl: './liv-facture.component.scss'
})
export class LivFactureComponent {
  @Input() currentUser!: IUser;
  @Input() livraison_id: number | undefined;
  @Input() livraison!: ILivraison;
  @Input() commandeLineList: ICommandeLine[] = [];
  isLoading = false;

  constructor(private router: Router,
    private currencyPipe: CurrencyPipe,
    private livraisonService: LivraisonService,
    private commandeLineService: CommandeLineService,
    private toastr: ToastrService
  ) { }


  // Plat
  get totalPlatTVA(): number {
    return this.commandeLineList.filter((f) => f.Plat!.tva === 16).reduce((sum, item) => sum + (item.quantity * item.Plat!.prix_vente), 0);
  }
  get totalPlatSansTVA(): number {
    return this.commandeLineList.filter((f) => f.Plat!.tva !== 16).reduce((sum, item) => sum + (item.quantity * item.Plat!.prix_vente), 0);
  }

  //  Product
  get totalProductTVA(): number {
    return this.commandeLineList.filter((f) => f.Product!.tva === 16).reduce((sum, item) => sum + (item.quantity * item.Product!.prix_vente), 0);
  }
  get totalProductSansTVA(): number {
    return this.commandeLineList.filter((f) => f.Product!.tva !== 16).reduce((sum, item) => sum + (item.quantity * item.Product!.prix_vente), 0);
  }


  get subtotalTVA(): number {
    return this.totalPlatTVA + this.totalProductTVA;
  }

  get subtotalSansTVA(): number {
    return this.totalPlatSansTVA + this.totalProductSansTVA;
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

  onSubmitFacture(status: string) {
    try {
      this.isLoading = true;
      var body: ILivraison = {
        area_id: parseInt(this.livraison.Area!.ID!.toString()),
        cout_livraison: parseFloat(this.livraison.cout_livraison.toString()),
        client_id: parseInt(this.livraison.Client!.ID!.toString()),
        livreur_id: parseInt(this.livraison.Livreur!.ID!.toString()),
        operator_name: this.livraison.operator_name,
        pos_id: parseInt(this.currentUser.pos!.ID!.toString()),
        status: status,
        signature: this.currentUser.fullname,
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      this.livraisonService.update(this.livraison_id!, body).subscribe((res) => {
        this.isLoading = false;
        this.toastr.success(`Facture ${status} effectuée avec succès!`, 'Success!');
        this.router.navigate(['/web/livraisons/livraison-list']);
      });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }


  restitutionBtn(id: number) {
    try {
      this.isLoading = true;
      this.commandeLineService.delete(id).subscribe(() => {
        this.isLoading = false;
        this.toastr.info('Livraison annulée avec succès!', 'Success!');
      });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }


  delete(): void {
    this.isLoading = true;
    this.livraisonService.delete(this.livraison_id!).subscribe(() => {
      for (let index = 0; index < this.commandeLineList.length; index++) {
        const element = this.commandeLineList[index];
        this.restitutionBtn(element.ID!);
      };
      this.isLoading = false;
      this.router.navigate(['/web/livraisons/livraison-list']);
      this.toastr.info('Livraison annulée avec succès!', 'Success!');
    });
  }



}

