import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { routes } from '../../shared/routes/routes';
import { IPos } from '../../models/pos.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../auth/models/user';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { PosService } from './pos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent implements OnInit, AfterViewInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes;

  // Table 
  dataList: IPos[] = [];
  totalItems: number = 0;
  pageSize: number = 15;
  pageIndex: number = 0;
  length: number = 0;

  // Table 
  displayedColumns: string[] = ['status', 'name', 'email', 'telephone', 'manager', 'adresse', 'id'];
  dataSource = new MatTableDataSource<IPos>(this.dataList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public search = '';

  // Forms  
  idItem!: number;
  dataItem!: IPos; // Single data 

  formGroup!: FormGroup;
  currentUser!: IUser;
  isLoading = false;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private posService: PosService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.posService.refreshDataList$.subscribe(() => {
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

  ngOnInit() {
    this.loadUserData = true;
    this.isLoadingData = true;
    this.formGroup = this._formBuilder.group({
      name: ['', Validators.required],
      adresse: ['', Validators.required],
      email: ['', Validators.required],
      telephone: ['', Validators.required],
      manager: ['', Validators.required],
      status: ['', Validators.required],
    });

  }

  onPageChange(event: PageEvent): void {
    this.isLoadingData = true;
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.fetchProducts();
  }

  fetchProducts() {
    this.posService.getPaginatedById(this.currentUser.entreprise!.ID!, this.pageIndex, this.pageSize, this.search).subscribe(res => {
      this.dataList = res.data;
      this.totalItems = res.pagination.total_pages;
      this.length = res.pagination.length;
      this.dataSource = new MatTableDataSource<IPos>(this.dataList);
      this.dataSource.sort = this.sort;

      this.isLoadingData = false;
    });
  }

  onSearchChange(search: string) {
    this.search = search;
    this.fetchProducts();
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
        var body = {
          entreprise_id: parseInt(this.currentUser.entreprise!.ID!.toString()),
          name: this.formGroup.value.name,
          adresse: this.formGroup.value.adresse,
          email: this.formGroup.value.email,
          telephone: this.formGroup.value.telephone,
          manager: this.formGroup.value.manager,
          status: (this.formGroup.value.status) ? this.formGroup.value.status : false,
          signature: this.currentUser.fullname,
        };
        this.posService.create(body).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('POS crée avec succès!', 'Success!');
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error(`${err.error.message}`, 'Oupss!');
            console.log(err);
          }
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
      var body = {
        entreprise_id: parseInt(this.currentUser.entreprise!.ID!.toString()),
        name: this.formGroup.value.name,
        adresse: this.formGroup.value.adresse,
        email: this.formGroup.value.email,
        telephone: this.formGroup.value.telephone,
        manager: this.formGroup.value.manager,
        status: (this.formGroup.value.status) ? this.formGroup.value.status : false,
        signature: this.currentUser.fullname,
      };
      this.posService.update(this.idItem, body)
        .subscribe({
          next: (res) => {
            this.formGroup.reset();
            this.toastr.success('Modification enregistré!', 'Success!');
            this.isLoading = false;
          },
          error: err => {
            console.log(err);
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            this.isLoading = false;
          }
        });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  findValue(value: number) {
    this.idItem = value;
    this.posService.get(this.idItem).subscribe(item => {
      this.dataItem = item.data;
      this.formGroup.patchValue({
        entreprise_id: this.dataItem.entreprise_id,
        name: this.dataItem.name,
        adresse: this.dataItem.adresse,
        email: this.dataItem.email,
        telephone: this.dataItem.telephone,
        manager: this.dataItem.manager,
        status: this.dataItem.status,
      });
    }
    );
  }



  delete(): void {
    this.isLoading = true;
    this.posService
      .delete(this.idItem)
      .subscribe({
        next: () => {
          this.formGroup.reset();
          this.toastr.info('Supprimé avec succès!', 'Success!');
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          console.log(err);
        }
      }
      );
  }

}
