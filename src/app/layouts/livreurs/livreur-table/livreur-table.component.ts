import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/auth.service';
import { IUser } from '../../../auth/models/user';
import { routes } from '../../../shared/routes/routes';
import { ILivreur } from '../../../models/livreur.model';
import { LivreurService } from '../livreur.service';

@Component({
  selector: 'app-livreur-table',
  templateUrl: './livreur-table.component.html',
  styleUrl: './livreur-table.component.scss'
})
export class LivreurTableComponent implements OnInit, AfterViewInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes;

  // Table 
  dataList: ILivreur[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;

  // Table 
  displayedColumns: string[] = ['name_society', 'livreur_name', 'telephone', 'email', 'rccm', 'idnat', 'action', 'id'];
  dataSource = new MatTableDataSource<ILivreur>(this.dataList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public search = '';

  // Forms  
  idItem!: number;
  dataItem!: ILivreur; // Single data 

  formGroup!: FormGroup;
  currentUser!: IUser;
  isLoading = false;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private livreurService: LivreurService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.livreurService.refreshDataList$.subscribe(() => {
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
      name_society: ['', Validators.required],
      livreur_name: ['', Validators.required],
      telephone: ['', Validators.required],
      email: [''],
      rccm: [''],
      idnat: [''],
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
      this.livreurService.getPaginatedEntreprise(currentUser.entreprise?.code!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
        this.dataList = res.data;
        this.totalItems = res.pagination.total_pages;
        this.length = res.pagination.length;
        this.dataSource = new MatTableDataSource<ILivreur>(this.dataList);
        this.dataSource.sort = this.sort;

        this.isLoadingData = false;
      });
    } else {
      this.livreurService.getPaginatedEntrepriseByPos(currentUser.entreprise?.code!, currentUser.pos?.ID!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
        this.dataList = res.data;
        this.totalItems = res.pagination.total_pages;
        this.length = res.pagination.length;
        this.dataSource = new MatTableDataSource<ILivreur>(this.dataList);
        this.dataSource.sort = this.sort;

        this.isLoadingData = false;
      });
    }
  }

  onSearchChange(search: string) {
    this.search = search;
    this.fetchProducts(this.currentUser);
  }


  generateMailtoLink(email: string): string {
    return `mailto:${email}`;
  }

  generateTeltoLink(tel: string): string {
    return `tel:${tel}`;
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
        const body: ILivreur = {
          name_society: this.formGroup.value.name_society,
          livreur_name: this.formGroup.value.livreur_name,
          telephone: this.formGroup.value.telephone,
          email: this.formGroup.value.email,
          rccm: this.formGroup.value.rccm,
          idnat: this.formGroup.value.idnat,
          signature: this.currentUser.fullname,
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        this.livreurService.create(body).subscribe(() => {
          this.isLoading = false;
          this.formGroup.reset();
          this.toastr.success('Livreur ajouté avec succès!', 'Success!');
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
      const body: ILivreur = {
        name_society: this.formGroup.value.name_society,
        livreur_name: this.formGroup.value.livreur_name,
        telephone: this.formGroup.value.telephone,
        email: this.formGroup.value.email,
        rccm: this.formGroup.value.rccm,
        idnat: this.formGroup.value.idnat,
        signature: this.currentUser.fullname,
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      this.livreurService.update(this.idItem, body).subscribe(() => {
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
    this.livreurService.get(this.idItem).subscribe(item => {
      this.dataItem = item.data;
      this.formGroup.patchValue({
        name_society: this.dataItem.name_society,
        livreur_name: this.dataItem.livreur_name,
        telephone: this.dataItem.telephone,
        email: this.dataItem.email,
        rccm: this.dataItem.rccm,
        idnat: this.dataItem.idnat,
      });
    });
  }


  delete(): void {
    this.isLoading = true;
    this.livreurService.delete(this.idItem).subscribe(() => {
      this.formGroup.reset();
      this.toastr.info('Supprimé avec succès!', 'Success!');
      this.isLoading = false;
    });
  }

}


