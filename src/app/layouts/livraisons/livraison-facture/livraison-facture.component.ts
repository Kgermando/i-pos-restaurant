import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { IUser } from '../../../auth/models/user'; 
import { ICommandeLine } from '../../../models/commande_line.model';
import { PdfService } from '../../../shared/services/pdf.service';
import { CommandeLineService } from '../../commandes-lines/commande-line.service'; 
import { ILivraison } from '../../../models/livraison.model';
import { LivraisonService } from '../livraison.service';

@Component({
  selector: 'app-livraison-facture',
  templateUrl: './livraison-facture.component.html',
  styleUrl: './livraison-facture.component.scss'
})
export class LivraisonFactureComponent implements OnInit {

  isLoading = false;
  currentUser!: IUser;
  livraisonId!: number;
  commandeLineList: ICommandeLine[] = [];
  livraison!: ILivraison;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private livraisonService: LivraisonService,
    private commaneLineService: CommandeLineService,
    private pdfService: PdfService,
  ) { }


  ngOnInit(): void {
    this.isLoading = true;
     this.route.params.subscribe(routeParams => {
      this.livraisonId = routeParams['id'];
      this.getProduct(this.livraisonId);
    });
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

   // Get One commande
   getProduct(id: any) { 
    this.livraisonService.get(Number(id)).subscribe(item => {
      this.livraison = item.data;
      this.commaneLineService.getAllByIdLivraison(this.livraison!.ID!).subscribe((line) => {
        this.commandeLineList = line.data; 
        this.isLoading = false;
      });
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

