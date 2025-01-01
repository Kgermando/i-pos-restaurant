import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { IUser } from '../../../auth/models/user'; 
import { ICommandeLine } from '../../../models/commande_line.model';
import { routes } from '../../../shared/routes/routes';
import { PdfService } from '../../../shared/services/pdf.service';
import { CommandeLineService } from '../../commandes-lines/commande-line.service';
import { IdDataService } from '../../commandes-lines/id-data.service'; 
import { ILivraison } from '../../../models/livraison.model';
import { LivraisonService } from '../livraison.service';

@Component({
  selector: 'app-livraison-line',
  templateUrl: './livraison-line.component.html',
  styleUrl: './livraison-line.component.scss'
})
export class LivraisonLineComponent implements OnInit {
  loadUserData = false;
  loading = false;
  public routes = routes;

  currentUser!: IUser; 

  // Panier
  totalCart = signal<number>(0);
  totalLength = signal<number>(0);

  // Taille des produits et plats
  prodLength = signal<number>(0);
  platLength = signal<number>(0);
  

  livraisonId!: number;
  livraison!: ILivraison; 
  commandeLineList: ICommandeLine[] = []; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private livraisonService: LivraisonService,
    private commaneLineService: CommandeLineService,
    private idDataService: IdDataService,
    private pdfService: PdfService,
  ) { }

  ngOnInit() {
    this.loadUserData = true;
    this.loading = true;
    this.route.params.subscribe(routeParams => {
      this.livraisonId = routeParams['id'];
      this.idDataService.changeId(this.livraisonId);
      this.commaneLineService.refreshDataList$.subscribe(() => {
        this.getProduct(this.livraisonId);
      });
      this.getProduct(this.livraisonId);
    });
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.idDataService.prodLength.subscribe(length => {
          this.prodLength.set(length);
        });
        this.idDataService.platLength.subscribe(length => {
          this.platLength.set(length);
        });
      },
      error: (error) => {
        this.loading = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }


  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }


  // Get One commande
  getProduct(id: any) {
    this.livraisonService.get(Number.parseInt(id)).subscribe(res => {
      this.livraison = res.data;
      this.commaneLineService.getAllByIdLivraison(this.livraison.ID!).subscribe((line) => {
        this.commandeLineList = line.data;
        this.totalLength.set(this.commandeLineList.length);
        this.loading = false;
      }); 
    });
  }


 
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
    return  this.totalPlatTVA + this.totalProductTVA;
  }

  get subtotalSansTVA(): number {
    return  this.totalPlatSansTVA + this.totalProductSansTVA;
  }


  get tax(): number {
    return this.subtotalTVA * 0.16; // 16% de TVA
  }

  get total(): number {
    return this.subtotalSansTVA + this.subtotalTVA + this.tax;
  }


  generatePdf() {
    this.pdfService.generateInvoice(this.commandeLineList);
  }
}


