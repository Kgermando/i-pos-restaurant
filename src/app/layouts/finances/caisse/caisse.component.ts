import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../../auth/models/user'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CurrencyPipe } from '@angular/common'; 
import { ToastrService } from 'ngx-toastr';
import { ICaisse } from '../../../models/caisse.model';
import { CaisseService } from './caisse.service';


@Component({
  selector: 'app-caisse',
  templateUrl: './caisse.component.html',
  styleUrl: './caisse.component.scss'
})
export class CaisseComponent implements OnInit, AfterViewInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes;

  // Table 
  dataList: ICaisse[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;

  // Table 
  displayedColumns: string[] = ['createdat', 'type_transaction', 'montant', 'libelle', 'reference', 'pos', 'signature', 'id'];
  dataSource = new MatTableDataSource<ICaisse>(this.dataList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public search = '';

  // Forms  
  idItem!: number;
  dataItem!: ICaisse; // Single data 

  formGroup!: FormGroup;
  currentUser!: IUser;
  isLoading = false;  
 
  type_transaction: string[] = ['Entrée', 'Sortie'];

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private caisseService: CaisseService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.caisseService.refreshDataList$.subscribe(() => {
          this.fetchProducts(this.currentUser);
        });
        this.fetchProducts(this.currentUser);
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
    this.formGroup = this._formBuilder.group({
      // type_transaction: ['', Validators.required],
      montant: ['', Validators.required],
      libelle: ['', Validators.required],
    });
  }

  onPageChange(event: PageEvent): void {
    this.isLoadingData = true;
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.fetchProducts(this.currentUser);
  }


  fetchProducts(currentUser: IUser) {
    if (currentUser.role === 'Manager général' ||
      currentUser.role === 'Support') {
      this.caisseService.getPaginatedEntreprise(currentUser.entreprise?.code!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
        this.dataList = res.data;
        this.totalItems = res.pagination.total_pages;
        this.length = res.pagination.length;
        this.dataSource = new MatTableDataSource<ICaisse>(this.dataList);
        this.dataSource.sort = this.sort;

        this.isLoadingData = false;
      });
    } else {
      this.caisseService.getPaginatedEntrepriseByPos(currentUser.entreprise?.code!, currentUser.pos?.ID!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
        this.dataList = res.data;
        this.totalItems = res.pagination.total_pages;
        this.length = res.pagination.length;
        this.dataSource = new MatTableDataSource<ICaisse>(this.dataList);
        this.dataSource.sort = this.sort;

        this.isLoadingData = false;
      });
    }
  }

  onSearchChange(search: string) {
    this.search = search;
    this.fetchProducts(this.currentUser);
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

  
  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }

  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var code = Math.floor(1000000000 + Math.random() * 90000000000);
        const body: ICaisse = {
          type_transaction: 'Sortie', // this.formGroup.value.type_transaction,
          montant: this.formGroup.value.montant,
          libelle: this.formGroup.value.libelle,
          reference: code.toString(),
          signature: this.currentUser.fullname,
          pos_id: parseInt(this.currentUser.pos!.ID.toString()),
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        this.caisseService.create(body).subscribe((res) => {
          this.isLoading = false;
          this.formGroup.reset();
          this.toastr.success(`Caisse ${res.data.type_transaction} ajoutée avec succès!`, 'Success!');
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
      const body: ICaisse = {
        type_transaction: this.dataItem.type_transaction, // this.formGroup.value.type_transaction,
        montant: this.formGroup.value.montant,
        libelle: this.formGroup.value.libelle,
        reference: this.dataItem.reference,
        signature: this.currentUser.fullname,
        pos_id: parseInt(this.currentUser.pos!.ID.toString()),
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      this.caisseService.update(this.idItem, body).subscribe(() => {
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
    this.caisseService.get(this.idItem).subscribe(item => {
      this.dataItem = item.data;
      this.formGroup.patchValue({
        type_transaction: this.dataItem.type_transaction,
        montant: this.dataItem.montant,
        libelle: this.dataItem.libelle,
        reference: this.dataItem.reference,
        pos_id: this.dataItem.pos_id,
        code_entreprise: this.dataItem.code_entreprise,
      });
    });
  }


  delete(): void {
    this.isLoading = true;
    this.caisseService.delete(this.idItem).subscribe(() => {
      this.formGroup.reset(); 
      this.toastr.info('Supprimé avec succès!', 'Success!');
      this.isLoading = false;
    });
  }
 
 
}

