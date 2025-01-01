import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { routes } from '../../shared/routes/routes';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../../auth/models/user';
import { ICommande } from '../../models/commande.model';
import { ICommandeLine } from '../../models/commande_line.model';
import { PdfService } from '../../shared/services/pdf.service';
import { CommandeService } from '../commandes/commande.service';
import { CommandeLineService } from './commande-line.service';
import { IdDataService } from './id-data.service';
import { ToastrService } from 'ngx-toastr';
import { IClient } from '../../models/client.model';
import { ClientService } from '../clients/client.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
  selector: 'app-commandes-lines',
  templateUrl: './commandes-lines.component.html',
  styleUrl: './commandes-lines.component.scss'
})
export class CommandesLinesComponent implements OnInit {
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


  commandeId!: number;
  commande!: ICommande;
  commandeLineList: ICommandeLine[] = [];

  isLoading = false;

  searchField = '';
  clientList: IClient[] = [];
  clientListFilter: IClient[] = [];
  filteredOptionsClient: IClient[] = [];
  totalItemsClient: number = 0;
  pageSizeClient: number = 15;
  pageIndexClient: number = 0;
  lengthClient: number = 0;
  @ViewChild('client_id') client_id!: ElementRef<HTMLInputElement>;
  clientId!: number;
  isloadClient = signal<boolean>(false);
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private commandeService: CommandeService,
    private commaneLineService: CommandeLineService,
    private idDataService: IdDataService,
    private pdfService: PdfService,
    private clientService: ClientService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadUserData = true;
    this.loading = true;
    this.isloadClient.set(true);
    this.route.params.subscribe(routeParams => {
      this.commandeId = routeParams['id'];
      this.idDataService.changeId(this.commandeId);
      this.commaneLineService.refreshDataList$.subscribe(() => {
        this.getProduct(this.commandeId);
      });
      this.getProduct(this.commandeId);
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
        this.getAllClient(this.currentUser);
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
    this.commandeService.get(Number.parseInt(id)).subscribe(res => {
      this.commande = res.data;
      this.commaneLineService.getAllById(this.commande.ID!).subscribe((line) => {
        this.commandeLineList = line.data;
        this.totalLength.set(this.commandeLineList.length);
        this.loading = false;
      });
    });
  }



  getAllClient(currentUser: IUser): void { 
    const filterValue = this.client_id.nativeElement.value.toLowerCase();
    this.clientService.getPaginatedEntreprise(currentUser.entreprise?.code!, this.pageIndexClient, this.pageSizeClient, this.searchField).subscribe((res) => {
      this.clientList = res.data;
      this.clientListFilter = this.clientList;
      this.filteredOptionsClient = this.clientListFilter.filter(o => o.fullname.toLowerCase().includes(filterValue));
      this.totalItemsClient = res.pagination.total_pages;
      this.lengthClient = res.pagination.length;
      this.isloadClient.set(false);
    });
  }

  displayFnClient(client: any): any {
    return client && client.fullname ? client.fullname : '';
  }

  optionSelectedClient(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.value;
    this.clientId = selectedOption.ID;
  }


  onChange(event: any) {
    console.log("Submit", event.value)
    // this.onSubmit();
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
    return this.totalPlatTVA + this.totalProductTVA;
  }

  get subtotalSansTVA(): number {
    return this.totalPlatSansTVA + this.totalProductSansTVA;
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


  onSubmit() {
    try {
      this.isLoading = true;
      const body: ICommande = {
        ncommande: this.commande.ncommande,
        status: this.commande.status,
        table_box_id: parseInt(this.commande.table_box_id.toString()),
        client_id: parseInt(this.clientId.toString()),
        signature: this.currentUser.fullname,
        pos_id: parseInt(this.currentUser.pos!.ID.toString()),
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      this.commandeService.update(this.commande.ID!, body).subscribe((res) => {
        this.isLoading = false;
        this.toastr.success('Client ajoutée avec succès!', 'Success!');
      });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }
}

