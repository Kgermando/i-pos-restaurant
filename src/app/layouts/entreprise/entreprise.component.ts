import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { routes } from '../../shared/routes/routes';
import { IEntreprise } from '../../models/entreprise.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { EntrepriseService } from './entreprise.service';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../auth/models/user';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrl: './entreprise.component.scss'
})
export class EntrepriseComponent implements OnInit, AfterViewInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes;
  public sidebarPopup1 = false;
  public sidebarPopup2 = false;

  // Table 
  dataList: IEntreprise[] = [];
  totalItems: number = 0;
  pageSize: number = 15;
  pageIndex: number = 0;
  length: number = 0;

  // Table 
  displayedColumns: string[] = ['id', 'status', 'type_entreprise', 'code', 'name', 'rccm', 'idnat', 'email', 'telephone', 'manager', 'total_user', 'total_pos', 'abonnement', 'id'];
  dataSource = new MatTableDataSource<IEntreprise>(this.dataList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('myOffcanvas', { static: false }) offcanvasElement!: ElementRef;

  public search = '';

  // Forms  
  idItem!: number;
  dataItem!: IEntreprise; // Single data 

  typeEntrepriseList: string[] = ['PME', 'GE', 'Particulier'];

  formGroup!: FormGroup;
  currentUser!: IUser;
  isLoading = false;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private entrepriseService: EntrepriseService,
    private usersService: UserService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.entrepriseService.refreshDataList$.subscribe(() => {
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
      type_entreprise: ['', Validators.required],
      name: ['', Validators.required], 
      rccm: [''],
      idnat: [''],
      email: [''],  
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
    this.entrepriseService.getPaginated(this.pageIndex, this.pageSize, this.search).subscribe(res => {
      this.dataList = res.data;
      this.totalItems = res.pagination.total_pages;
      this.length = res.pagination.length;
      this.dataSource = new MatTableDataSource<IEntreprise>(this.dataList);
      this.dataSource.sort = this.sort;

      console.log("dataList", this.dataList);

      this.isLoadingData = false;
    });
  }

  onSearchChange(search: string) {
    this.search = search;
    this.fetchProducts();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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


  openSidebarPopup1() {
    this.sidebarPopup1 = !this.sidebarPopup1;
  }
  openSidebarPopup2() {
    this.sidebarPopup2 = !this.sidebarPopup2;
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var code = Math.floor(1000 + Math.random() * 90000);
        var body = {
          type_entreprise: this.formGroup.value.type_entreprise,
          name: this.formGroup.value.name,
          code: code.toString(),
          rccm: this.formGroup.value.rccm,
          idnat: this.formGroup.value.idnat,
          email: this.formGroup.value.email,
          telephone: this.formGroup.value.telephone,
          manager: this.formGroup.value.manager,
          status: (this.formGroup.value.status) ? this.formGroup.value.status : false,
          abonnement: new Date(),
          signature: this.currentUser.fullname,
        };
        this.entrepriseService.create(body).subscribe({
          next: (res) => {
            const entreprise: IEntreprise = res.data; 
            var dataUser = {
              entreprise_id: entreprise.id,
              fullname: entreprise.manager,
              email: entreprise.email,
              telephone: entreprise.telephone,
              role: 'Manager général',
              password: '1234',
              password_confirm: '1234',
              permission: 'ALL',
              status: true,
              currency: 'CDF',
              signature: this.currentUser.fullname,
            };
            this.usersService.create(dataUser).subscribe({
              next: () => {
                this.isLoading = false;
                this.formGroup.reset();
                this.toastr.success('Entreprise et Compte crées avec succès!', 'Success!');
                this.offcanvasElement.nativeElement.click();
              },
              error: (err) => {
                this.isLoading = false;
                this.toastr.error(`${err.error.message}`, 'Oupss!');
                console.log(err);
              }
            });
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
        type_entreprise: this.formGroup.value.type_entreprise,
        name: this.formGroup.value.name,
        code: this.dataItem.code,
        rccm: this.formGroup.value.rccm,
        idnat: this.formGroup.value.idnat,
        email: this.formGroup.value.email,
        telephone: this.formGroup.value.telephone,
        manager: this.formGroup.value.manager,
        status: (this.formGroup.value.status) ? this.formGroup.value.status : false,
        signature: this.currentUser.fullname,
      };
      this.entrepriseService.update(this.idItem, body)
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
    this.entrepriseService.get(this.idItem).subscribe(item => {
      this.dataItem = item.data;
      this.formGroup.patchValue({
        type_entreprise: this.dataItem.type_entreprise,
        name: this.dataItem.name,
        code: this.dataItem.code,
        rccm: this.dataItem.rccm,
        idnat: this.dataItem.idnat,
        email: this.dataItem.email,
        telephone: this.dataItem.telephone,
        manager: this.dataItem.manager,
        status: this.dataItem.status,
        abonnement: this.dataItem.abonnement,
      });
    }
    );
  }



  delete(): void {
    this.isLoading = true;
    this.entrepriseService
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
