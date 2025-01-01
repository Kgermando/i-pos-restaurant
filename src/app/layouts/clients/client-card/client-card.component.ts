import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IClient } from '../../../models/client.model';
import { routes } from '../../../shared/routes/routes';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../../auth/models/user';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.scss'
})
export class ClientCardComponent implements OnInit, AfterViewInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes;
  public sidebarPopup1 = false;
  public sidebarPopup2 = false;

  // Table 
  dataList: IClient[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public search = '';

  // Forms  
  idItem!: number;
  dataItem!: IClient; // Single data 

  formGroup!: FormGroup;
  currentUser!: IUser;
  isLoading = false;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private clientService: ClientService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.clientService.refreshDataList$.subscribe(() => {
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
      fullname: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', Validators.required],
      adress: ['', Validators.required],
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
      this.clientService.getPaginatedEntreprise(currentUser.entreprise?.code!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
        this.dataList = res.data;
        this.totalItems = res.pagination.total_pages;
        this.length = res.pagination.length;

        this.isLoadingData = false;
      });
    } else {
      this.clientService.getPaginatedEntrepriseByPos(currentUser.entreprise?.code!, currentUser.pos?.ID!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
        this.dataList = res.data;
        this.totalItems = res.pagination.total_pages;
        this.length = res.pagination.length;

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


  generateMailtoLink(email: string): string {
    return `mailto:${email}`;
  }

  generateTeltoLink(tel: string): string {
    return `tel:${tel}`;
  }



  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        const body: IClient = {
          fullname: this.formGroup.value.fullname,
          telephone: this.formGroup.value.telephone,
          email: this.formGroup.value.email,
          adress: this.formGroup.value.adress,
          signature: this.currentUser.fullname,
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()), 
        };
        this.clientService.create(body).subscribe(() => {
          this.isLoading = false;
          this.formGroup.reset();
          this.toastr.success('Client ajoutée avec succès!', 'Success!');
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
      const body: IClient = {
        fullname: this.formGroup.value.fullname,
        telephone: this.formGroup.value.telephone,
        email: this.formGroup.value.email,
        adress: this.formGroup.value.adress,
        signature: this.currentUser.fullname,
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      this.clientService.update(this.idItem, body).subscribe(() => {
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
    this.clientService.get(this.idItem).subscribe(item => {
      this.dataItem = item.data;
      this.formGroup.patchValue({
        fullname: this.dataItem.fullname,
        telephone: this.dataItem.telephone,
        email: this.dataItem.email,
        adress: this.dataItem.adress,
      });
    });
  }


  delete(): void {
    this.isLoading = true;
    this.clientService.delete(this.idItem).subscribe(() => {
      this.formGroup.reset();
      this.toastr.info('Supprimé avec succès!', 'Success!');
      this.isLoading = false;
    });
  }

}


