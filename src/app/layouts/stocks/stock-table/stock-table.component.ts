import { AfterViewInit, Component, computed, OnInit, signal, ViewChild } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IUser } from '../../../auth/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IStock } from '../../../models/stock.model';
import { IProduct } from '../../../models/product.model';
import { IFournisseur } from '../../../models/fournisseur.model';
import { CurrencyPipe } from '@angular/common'; 
import { IStockDispo } from '../../../models/stock_dispo.model';
import { FournisseurService } from '../../fournisseurs/fournisseur.service';
import { StockService } from '../stock.service';
import { ProductService } from '../../products/product.service';
import { CommandeLineService } from '../../commandes-lines/commande-line.service';


@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrl: './stock-table.component.scss'
})
export class StockTableComponent implements OnInit, AfterViewInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes;
  public sidebarPopup1 = false;
  public sidebarPopup2 = false;

  // Table 
  dataList: IStock[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;
  public search = '';

  // Table
  displayedColumns: string[] = ['created', 'quantity', 'prix_achat', 'date_expiration', 'description', 'fournisseur_id', 'id'];
  dataSource = new MatTableDataSource<IStock>(this.dataList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  // Forms  
  idItem!: number;
  dataItem!: IStock; // Single data 

  formGroup!: FormGroup;
  currentUser!: IUser;
  isLoading = false;

  productId!: number;
  product!: IProduct;

  fournisseurList: IFournisseur[] = [];
  fournisseur!: IFournisseur;
 

  stockQty = signal<number>(0);
  cmdLineQty = signal<number>(0);
  pourcentQty = computed(() => (this.cmdLineQty() * 100) / this.stockQty());
  pourcentStockRestant = computed(() => 100 - (this.cmdLineQty() * 100 / this.stockQty()));

  profitAttendu = signal<number>(0);  // marge beneficiaire
  profitObtenu = signal<number>(0);
  pourcentProfit = computed(() => (this.profitObtenu() * 100) / this.profitAttendu());

  prixVente = signal<number>(0); 
  valeurProductAttendu = computed(() => this.prixVente() * this.stockQty());
  valeurProductObtenu = computed(() => this.prixVente() * this.cmdLineQty());
  pourcentValeurProduit = computed(() => (this.valeurProductObtenu() * 100) / this.valeurProductAttendu());

 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private productService: ProductService,
    private stockService: StockService,
    private commaneLineService: CommandeLineService,
    private fournisseurService: FournisseurService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.stockService.refreshDataList$.subscribe(() => {
          this.fetchProducts();
        });
        this.fetchProducts();
        this.getFournisseurs(this.currentUser);
      },
      error: (error) => {
        this.isLoadingData = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

  ngOnInit() {
    this.loadUserData = true;
    this.isLoadingData = true;
    this.route.params.subscribe(routeParams => {
      this.productId = routeParams['id'];
      this.getProduct(Number(this.productId));
    });

    this.formGroup = this._formBuilder.group({
      prix_achat: ['', Validators.required],
      quantity: ['', Validators.required],
      description: ['', Validators.required],
      date_expiration: ['', Validators.required],
      fournisseur_id: [''],
    });
  }

  onPageChange(event: PageEvent): void {
    this.isLoadingData = true;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchProducts();
  }

  getProduct(id: any) {
    this.productService.get(Number.parseInt(id)).subscribe(item => {
      this.product = item.data;
      this.prixVente.set(this.product.prix_vente);
    });
  }
 

  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }

  fetchProducts() {
    this.stockService.getPaginatedById(this.product.ID!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
      this.dataList = res.data;
      this.totalItems = res.pagination.total_pages;
      this.length = res.pagination.length;
      this.dataSource = new MatTableDataSource<IStock>(this.dataList);
      this.dataSource.sort = this.sort;
      this.isLoadingData = false;
    });
    this.getTotalQty();
  }

  onSearchChange(search: string) {
    this.search = search;
    this.fetchProducts();
  }


  getFournisseurs(currentUser: IUser) {
    this.fournisseurService.getAllEntreprise(currentUser.entreprise?.code!).subscribe(val => {
      this.fournisseurList = val.data;
    });
  }

  getTotalQty() {
    this.stockService.getTotalQty(this.product.ID!).subscribe((res) => {
      this.stockQty.set(res.data);
      this.commaneLineService.getTotalQty(this.product.ID!).subscribe((line) => {
        this.cmdLineQty.set(line.data);  
        this.stockService.GetStockMargeBeneficiaire(this.product.ID!).subscribe(r => { 
          const mbAttendu = (this.product.prix_vente - r.data.prix_achat) * r.data.quantity;
          const mbObtenu = (this.product.prix_vente - r.data.prix_achat) * line.data;
          this.profitAttendu.set(mbAttendu);
          this.profitObtenu.set(mbObtenu); 
        }); 
      }); 
    });
  }


  public sortData(sort: Sort) {
    const data = this.dataList.slice();
    if (!sort.active || sort.direction === '') {
      this.dataList = data;
    } else {
      this.dataList = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }



  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        const body: IStock = {
          product_id: parseInt(this.productId.toString()),
          description: this.formGroup.value.description,
          fournisseur_id: parseInt(this.formGroup.value.fournisseur_id.toString()),
          quantity: this.formGroup.value.quantity,
          prix_achat: this.formGroup.value.prix_achat,
          date_expiration: this.formGroup.value.date_expiration,
          signature: this.currentUser.fullname,
          pos_id: parseInt(this.currentUser.pos!.ID.toString()),
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        console.log("body", body)
        this.stockService.create(body).subscribe(res => {
          this.isLoading = false;
          this.formGroup.reset();
          this.toastr.success('Stock ajouté avec succès!', 'Success!');
        });
      }
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }


  onSubmitUpdate() {
    try {
      this.isLoading = true;
      const body: IStock = {
        product_id: parseInt(this.dataItem.product_id.toString()),
        description: this.formGroup.value.description,
        fournisseur_id: parseInt(this.formGroup.value.fournisseur_id.toString()),
        quantity: this.formGroup.value.quantity,
        prix_achat: this.formGroup.value.prix_achat,
        date_expiration: this.formGroup.value.date_expiration,
        signature: this.currentUser.fullname,
        pos_id: parseInt(this.currentUser.pos!.ID.toString()),
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      console.log("body", body)
      this.stockService.update(this.idItem, body).subscribe(res => {
        this.formGroup.reset();
        this.toastr.success('Modification enregistrée!', 'Success!');
        this.isLoading = false;
      });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }


  findValue(value: number) {
    this.idItem = value;
    this.stockService.get(this.idItem).subscribe(item => {
      this.dataItem = item.data; 
      this.formGroup.patchValue({
        product_id: this.dataItem.product_id,
        description: this.dataItem.description,
        fournisseur_id: this.dataItem.fournisseur_id,
        quantity: this.dataItem.quantity,
        prix_achat: this.dataItem.prix_achat,
        date_expiration: this.dataItem.date_expiration,
        signature: this.dataItem.signature,
        code_entreprise: this.dataItem.code_entreprise,
      });
    });
  }


  delete(): void {
    this.stockService.delete(this.idItem).subscribe(() => {
      this.formGroup.reset();
      this.toastr.info('Supprimé avec succès!', 'Success!');
      this.isLoading = false;
    });
  }

}

