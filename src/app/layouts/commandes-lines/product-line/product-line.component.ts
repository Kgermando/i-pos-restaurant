import { Component, OnInit, signal } from '@angular/core'; 
import { IUser } from '../../../auth/models/user';
import { routes } from '../../../shared/routes/routes';
import { IProduct } from '../../../models/product.model';
import { ICommande } from '../../../models/commande.model';
import { ICommandeLine } from '../../../models/commande_line.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CommandeService } from '../../commandes/commande.service';
import { CurrencyPipe } from '@angular/common';
import { CommandeLineService } from '../commande-line.service';
import { ProductService } from '../../products/product.service';
import { ToastrService } from 'ngx-toastr';
import { IdDataService } from '../id-data.service';


@Component({
  selector: 'app-product-line',
  templateUrl: './product-line.component.html',
  styleUrl: './product-line.component.scss'
})
export class ProductLineComponent implements OnInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes;
  public sidebarPopup1 = false;
  public sidebarPopup2 = false;

  currentUser!: IUser;
  isLoading = false;

  quantity = signal<number>(1); // Initialiser à 1

  qty = signal<number>(1);

  qtyDispo = signal<number>(1); // Quantite disponible 

  public search = '';
  dataList: IProduct[] = [];

  commandeId!: number; 


  constructor(
    private router: Router,
    private authService: AuthService,
    private idDataService: IdDataService,
    private currencyPipe: CurrencyPipe, 
    private commaneLineService: CommandeLineService,
    private productService: ProductService, 
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadUserData = true;
    this.isLoadingData = true;
    this.idDataService.currentId.subscribe(id => {
      this.commandeId = id;
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.productService.refreshDataList$.subscribe(() => {
          this.fetchProducts();
        });
        this.fetchProducts();
      },
      error: (error) => {
        this.isLoadingData = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

  qtyOutput(qtee: number) {
    this.qtyDispo.set(qtee);
    console.log("qtyDispo",  this.qtyDispo())
  }


  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }
 

  // Get all products
  fetchProducts() {
    console.log("commandeId", this.commandeId);
    this.productService.getAllByEntrepriseByPosSearch(this.currentUser.entreprise?.code!, 
      this.currentUser.pos?.ID!, this.search).subscribe((res) => {
      this.dataList = res.data;
      this.idDataService.changeProd(this.dataList.length);
      this.isLoadingData = false;
    });
  }

  onSearchChange(search: string) {
    this.search = search;
    this.fetchProducts();
  }


  onQuantityChange(product: IProduct, newQuantity: number) {
    console.log("prod", product); 
    this.qty.set(newQuantity);
  }


  onSubmit(product: IProduct) {
    this.isLoading = true;
    const body: ICommandeLine = {
      commande_id: parseInt(this.commandeId!.toString()),
      product_id: product.ID!,
      plat_id: 0,
      quantity: this.qty(),
      code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
    };
    this.commaneLineService.create(body).subscribe(() => {
      this.toastr.success('Produit ajouté dans le panier!', 'Success!');
      this.qty.set(0);
      this.quantity.set(1);
      this.isLoading = false;
    });
  }

}

