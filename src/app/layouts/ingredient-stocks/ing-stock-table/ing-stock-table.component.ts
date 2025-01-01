import { AfterViewInit, Component,OnInit, signal, ViewChild } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IUser } from '../../../auth/models/user';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IFournisseur } from '../../../models/fournisseur.model';
import { CurrencyPipe, formatDate } from '@angular/common';
import { FournisseurService } from '../../fournisseurs/fournisseur.service';
import { IngStockService } from '../ing-stock.service';
import { IIngredient } from '../../../models/ingredient.model';
import { IIngredientStock } from '../../../models/ingredient_stock.model';
import { IngredientService } from '../../ingredients/ingredient.service';


@Component({
  selector: 'app-ing-stock-table',
  templateUrl: './ing-stock-table.component.html',
  styleUrl: './ing-stock-table.component.scss'
})
export class IngStockTableComponent implements OnInit, AfterViewInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes;

  // Table 
  dataList: IIngredientStock[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;
  public search = '';

  // Table
  displayedColumns: string[] = ['created', 'quantity', 'prix_achat', 'date_expiration', 'description', 'fournisseur_id', 'id'];
  dataSource = new MatTableDataSource<IIngredientStock>(this.dataList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  // Forms  
  idItem!: number;
  dataItem!: IIngredientStock; // Single data 

  formGroup!: FormGroup;
  currentUser!: IUser;
  isLoading = false;

  ingredientId!: number;
  ingredient!: IIngredient;

  fournisseurList: IFournisseur[] = [];
  fournisseur!: IFournisseur;

  montantTotalAchat = signal<number>(0); 
  stockTotal = signal<number>(0);
  stockDispo = signal<number>(0);
  pourcentstockDispo = signal<number>(0);


  dateRange!: FormGroup;
  rangeDate: any[] = [];
  start_date!: string;
  end_date!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private ingredientService: IngredientService,
    private ingStockService: IngStockService,
    private fournisseurService: FournisseurService,
    private toastr: ToastrService
  ) { }

  

  ngAfterViewInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.ingStockService.refreshDataList$.subscribe(() => {
          this.fetchProducts();
        });
        this.fetchProducts();
        this.getFournisseurs(this.currentUser);
        this.getStatsIngredientStock(this.currentUser, this.ingredient.ID!);
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
      this.ingredientId = routeParams['id'];
      this.getProduct(Number(this.ingredientId));
    });

    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.rangeDate = [firstDay, lastDay];

    this.dateRange = this._formBuilder.group({
      rangeValue: new FormControl(this.rangeDate),
    });
    this.start_date = formatDate(this.dateRange.value.rangeValue[0], 'yyyy-MM-dd', 'en-US');
    this.end_date = formatDate(this.dateRange.value.rangeValue[1], 'yyyy-MM-dd', 'en-US');

    this.formGroup = this._formBuilder.group({
      prix_achat: ['', Validators.required],
      quantity: ['', Validators.required],
      description: ['', Validators.required],
      date_expiration: ['', Validators.required],
      fournisseur_id: [''],
    });

    this.onChanges();
  }


  onChanges(): void {
    this.dateRange.valueChanges.subscribe(val => {
      this.start_date = formatDate(val.rangeValue[0], 'yyyy-MM-dd', 'en-US');
      this.end_date = formatDate(val.rangeValue[1], 'yyyy-MM-dd', 'en-US');
      this.getStatsIngredientStock(this.currentUser, this.ingredient.ID!);
      this.fetchProducts();
    });
  }


  onPageChange(event: PageEvent): void {
    this.isLoadingData = true;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchProducts();
  }

  getProduct(id: any) {
    this.ingredientService.get(Number.parseInt(id)).subscribe(item => {
      this.ingredient = item.data;
      // this.getStatsIngredientStock(this.currentUser, this.ingredient.ID!);
    });
  }

  getStatsIngredientStock(currentUser: IUser, ingredient_id: number) {
    this.ingStockService.GetStatsParIngredientStock(currentUser.entreprise!.code, ingredient_id, this.start_date, this.end_date).subscribe((res) => {
      this.montantTotalAchat.set(res.data.montanttotalachat);
      this.stockTotal.set(res.data.stocktotal);
      this.stockDispo.set(res.data.stockdispo);
      this.pourcentstockDispo.set(res.data.pourcentqtydispo);
    });
  }

  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }

  fetchProducts() {
    this.ingStockService.getPaginatedByIdRangeDate(
      this.ingredientId, this.pageIndex, this.pageSize, this.search, 
      this.start_date, this.end_date).subscribe((res) => {
      this.dataList = res.data;
      this.totalItems = res.pagination.total_pages;
      this.length = res.pagination.length;
      this.dataSource = new MatTableDataSource<IIngredientStock>(this.dataList);
      this.dataSource.sort = this.sort;
      this.isLoadingData = false;
    }); 
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
        const body: IIngredientStock = {
          ingredient_id: parseInt(this.ingredientId.toString()),
          description: this.formGroup.value.description,
          fournisseur_id: parseInt(this.formGroup.value.fournisseur_id.toString()),
          quantity: this.formGroup.value.quantity,
          prix_achat: this.formGroup.value.prix_achat,
          date_expiration: this.formGroup.value.date_expiration,
          signature: this.currentUser.fullname,
          pos_id: parseInt(this.currentUser.pos!.ID.toString()),
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        this.ingStockService.create(body).subscribe(res => {
          this.isLoading = false;
          this.formGroup.reset();
          this.getStatsIngredientStock(this.currentUser, this.ingredient.ID!);
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
      const body: IIngredientStock = {
        ingredient_id: parseInt(this.dataItem.ingredient_id.toString()),
        description: this.formGroup.value.description,
        fournisseur_id: parseInt(this.formGroup.value.fournisseur_id.toString()),
        quantity: this.formGroup.value.quantity,
        prix_achat: this.formGroup.value.prix_achat,
        date_expiration: this.formGroup.value.date_expiration,
        signature: this.currentUser.fullname,
        pos_id: parseInt(this.currentUser.pos!.ID.toString()),
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      this.ingStockService.update(this.idItem, body).subscribe(res => {
        this.formGroup.reset();
        this.getStatsIngredientStock(this.currentUser, this.ingredient.ID!);
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
    this.ingStockService.get(this.idItem).subscribe(item => {
      this.dataItem = item.data;
      this.formGroup.patchValue({
        ingredient_id: this.dataItem.ingredient_id,
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
    this.isLoading = true;
    this.ingStockService.delete(this.idItem).subscribe(() => {
      this.formGroup.reset();
      this.toastr.info('Supprimé avec succès!', 'Success!');
      this.isLoading = false;
    });
  }

}

