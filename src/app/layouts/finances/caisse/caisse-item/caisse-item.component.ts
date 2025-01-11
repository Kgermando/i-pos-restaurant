import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ICaisse, ICaisseItem } from '../../../../models/caisse.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../../../auth/models/user';
import { CurrencyPipe, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CaisseItemService } from '../caisse-item.service';
import { AuthService } from '../../../../auth/auth.service';
import { CaisseService } from '../caisse.service';

@Component({
  selector: 'app-caisse-item',
  templateUrl: './caisse-item.component.html',
  styleUrl: './caisse-item.component.scss'
})
export class CaisseItemComponent implements OnInit {
  loadUserData = false;
  isLoadingData = false;
  loading = false;

  dateRange!: FormGroup;
  start_date!: string;
  end_date!: string;
  rangeDate: any[] = [];

  // Table 
  dataItemList: ICaisseItem[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;

  // Table 
  displayedColumns: string[] = ['createdat', 'type_transaction', 'montant', 'libelle', 'reference', 'caisse', 'signature', 'id'];
  dataSource = new MatTableDataSource<ICaisseItem>(this.dataItemList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public search = '';
  currentUser!: IUser;
  // Forms  
  idItem!: number;
  dataItem!: ICaisseItem; // Single data 

  formGroupCaisse!: FormGroup;
  formGroup!: FormGroup;
  isLoading = false;

  type_transaction: string[] = ['Entrée', 'Sortie'];

  caisseID!: number;
  caisse!: ICaisse;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private caisseService: CaisseService,
    private caisseItemService: CaisseItemService,
    private toastr: ToastrService
  ) { }


  ngOnInit(): void {
    this.loadUserData = true;
    this.isLoadingData = true;
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.rangeDate = [firstDay, lastDay];

    this.dateRange = this._formBuilder.group({
      rangeValue: new FormControl(this.rangeDate),
    });
    this.start_date = formatDate(this.dateRange.value.rangeValue[0], 'yyyy-MM-dd', 'en-US');
    this.end_date = formatDate(this.dateRange.value.rangeValue[1], 'yyyy-MM-dd', 'en-US');
    this.route.params.subscribe(routeParams => {
      this.caisseID = routeParams['id'];
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.loadUserData = false;
          this.getProduct(this.caisseID);

          this.caisseItemService.refreshDataList$.subscribe(() => {
            this.fetchProducts(this.currentUser);
          });
          this.fetchProducts(this.currentUser);

          // Appel de la méthode onChanges
          this.onChanges();
        },
        error: (error) => {
          this.isLoadingData = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });
    });

    this.formGroupCaisse = this._formBuilder.group({
      name: ['', Validators.required],
    });

    this.formGroup = this._formBuilder.group({
      montant: ['', Validators.required],
      libelle: ['', Validators.required],
    });

  }


  // Méthode onChanges
  onChanges(): void {
    this.dateRange.valueChanges.subscribe((val) => {
      this.start_date = formatDate(val.rangeValue[0], 'yyyy-MM-dd', 'en-US');
      this.end_date = formatDate(val.rangeValue[1], 'yyyy-MM-dd', 'en-US');

      this.fetchProducts(this.currentUser);
    });
  }


  getProduct(id: any) {
    this.loading = true;
    this.caisseService.get(Number.parseInt(id)).subscribe(res => {
      this.caisse = res.data;
      this.loading = false;
    });
  }

  onPageChange(event: PageEvent): void {
    this.isLoadingData = true;
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.fetchProducts(this.currentUser);
  }

  fetchProducts(currentUser: IUser) {
    this.caisseItemService.getPaginatedCaisseItemByCaisseID(
      currentUser.entreprise?.code!, this.caisseID,
      this.pageIndex, this.pageSize, this.search,
      this.start_date, this.end_date
    ).subscribe((res) => {
      this.dataItemList = res.data;
      this.totalItems = res.pagination.total_pages;
      this.length = res.pagination.length;
      this.dataSource = new MatTableDataSource<ICaisseItem>(this.dataItemList);
      this.dataSource.sort = this.sort;

      this.isLoadingData = false;
    });
  }



  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }

  onSearchChange(search: string) {
    this.search = search;
    this.fetchProducts(this.currentUser);
  }

  public sortData(sort: Sort) {
    const data = this.dataItemList.slice();
    if (!sort.active || sort.direction === '') {
      this.dataItemList = data;
    } else {
      this.dataItemList = data.sort((a, b) => {
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
        var code = Math.floor(1000000000 + Math.random() * 90000000000);
        const body: ICaisseItem = {
          caisse_id: parseInt(this.caisseID.toString()),
          type_transaction: 'Sortie', // this.formGroup.value.type_transaction,
          montant: parseFloat(this.formGroup.value.montant),
          libelle: this.formGroup.value.libelle,
          reference: code.toString(),
          signature: this.currentUser.fullname,
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        this.caisseItemService.create(body).subscribe((res) => {
          this.isLoading = false;
          this.formGroup.reset();
          this.toastr.success(`Transaction ${res.data.type_transaction} ajoutée avec succès!`, 'Success!');
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
      const body: ICaisseItem = {
        caisse_id: parseInt(this.caisseID.toString()),
        type_transaction: this.dataItem.type_transaction, // this.formGroup.value.type_transaction,
        montant: parseFloat(this.formGroup.value.montant),
        libelle: this.formGroup.value.libelle,
        reference: this.dataItem.reference,
        signature: this.currentUser.fullname,
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      this.caisseItemService.update(this.idItem, body).subscribe(() => {
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
    this.caisseItemService.get(this.idItem).subscribe(item => {
      this.dataItem = item.data;
      this.formGroup.patchValue({
        caisse_id: this.dataItem.caisse_id,
        type_transaction: this.dataItem.type_transaction,
        montant: this.dataItem.montant,
        libelle: this.dataItem.libelle,
        reference: this.dataItem.reference,
        code_entreprise: this.dataItem.code_entreprise,
      });
    });
  }


  delete(): void {
    this.isLoading = true;
    this.caisseItemService.delete(this.idItem).subscribe(() => {
      this.formGroup.reset();
      this.toastr.info('Supprimé avec succès!', 'Success!');
      this.isLoading = false;
    });
  }


  findCaisseValue(id: number) {
    this.caisseService.get(id).subscribe(item => {
      this.formGroupCaisse.patchValue({
        name: item.data.name,
      });
    });
  }

  deleteCaisse(): void {
    this.isLoading = true;
    this.caisseService.delete(this.caisseID).subscribe(() => {
      this.formGroupCaisse.reset();
      this.toastr.info('Supprimé avec succès!', 'Success!');
      this.isLoading = false;
    });
  }

  editCaisse() {
    try {
      if (this.formGroupCaisse.valid) {
        this.isLoading = true;
        const body: ICaisse = {
          name: this.formGroupCaisse.value.name,
          signature: this.currentUser.fullname,
          pos_id: parseInt(this.currentUser.pos!.ID!.toString()),
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        this.caisseService.update(this.caisseID, body).subscribe((res) => {
          this.isLoading = false;
          this.formGroupCaisse.reset();
          this.toastr.success(`Caisse ${res.data.type_transaction} crée avec succès!`, 'Success!');
        });
      }
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

}
