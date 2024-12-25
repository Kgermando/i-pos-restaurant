import { Component, OnInit, signal } from '@angular/core';
import { IUser } from '../../../auth/models/user';
import { routes } from '../../../shared/routes/routes';
import { ICommande } from '../../../models/commande.model';
import { ICommandeLine } from '../../../models/commande_line.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CommandeService } from '../../commandes/commande.service';
import { CurrencyPipe } from '@angular/common';
import { CommandeLineService } from '../commande-line.service';
import { PdfService } from '../../../shared/services/pdf.service';
import { ProductService } from '../../products/product.service';
import { ToastrService } from 'ngx-toastr';
import { IPlat } from '../../../models/plat.model';
import { IdDataService } from '../id-data.service';
import { PlatService } from '../../plat/plat.service';

@Component({
  selector: 'app-plat-line',
  templateUrl: './plat-line.component.html',
  styleUrl: './plat-line.component.scss'
})
export class PlatLineComponent implements OnInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes;

  currentUser!: IUser;
  isLoading = false;

  quantity = signal<number>(1); // Initialiser à 1

  qty = signal<number>(1); // A ajouter au panier

  public search = '';
  dataList: IPlat[] = [];

  commandeId!: number; 

  constructor(
    private router: Router,
    private authService: AuthService,
    private idDataService: IdDataService,
    private currencyPipe: CurrencyPipe,
    private commaneLineService: CommandeLineService,
    private platService: PlatService,
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
        this.platService.refreshDataList$.subscribe(() => {
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

  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }


  // Get all products
  fetchProducts() {
    console.log("commandeId", this.commandeId);
    this.platService.getAllByEntrepriseByPosSearch(this.currentUser.entreprise?.code!, this.currentUser.pos?.ID!, this.search).subscribe((res) => {
      this.dataList = res.data;
      console.log("dataList", this.dataList);
      this.idDataService.changePlat(this.dataList.length);
      this.isLoadingData = false;
    });
  }

  onSearchChange(search: string) {
    this.search = search;
    this.fetchProducts();
  }


  onQuantityChange(product: IPlat, newQuantity: number) {
    console.log("prod", product);
    this.qty.set(newQuantity);
  }



  onSubmit(plat: IPlat) {
    this.isLoading = true;
    const body: ICommandeLine = {
      commande_id: parseInt(this.commandeId!.toString()),
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

