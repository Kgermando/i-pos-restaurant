import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { IUser } from '../../auth/models/user';
import { routes } from '../../shared/routes/routes';
import { IArea } from '../../models/area.model';
import { AreaService } from './area.service';
import { ProvinceList } from '../../utils/province-list';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss'
})
export class AreaComponent implements OnInit, AfterViewInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes;
  

  // Table 
  dataList: IArea[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;

  // Table 
  displayedColumns: string[] = ['name', 'province', 'id'];
  dataSource = new MatTableDataSource<IArea>(this.dataList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public search = '';

  // Forms  
  idItem!: number;
  dataItem!: IArea; // Single data 

  formGroup!: FormGroup;
  currentUser!: IUser;
  isLoading = false;

  provinceList:string[] = ProvinceList;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private areaService: AreaService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.areaService.refreshDataList$.subscribe(() => {
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
      name: ['', Validators.required],
      province: ['', Validators.required],
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
      this.areaService.getPaginatedEntreprise(currentUser.entreprise?.code!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
        this.dataList = res.data;
        this.totalItems = res.pagination.total_pages;
        this.length = res.pagination.length;
        this.dataSource = new MatTableDataSource<IArea>(this.dataList); 
        this.dataSource.sort = this.sort; 

        this.isLoadingData = false;
      });
    } else {
      this.areaService.getPaginatedEntrepriseByPos(currentUser.entreprise?.code!, currentUser.pos?.ID!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
        this.dataList = res.data;
        this.totalItems = res.pagination.total_pages;
        this.length = res.pagination.length;
        this.dataSource = new MatTableDataSource<IArea>(this.dataList); 
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
        const body: IArea = {
          name: this.formGroup.value.name,
          province: this.formGroup.value.province, 
          signature: this.currentUser.fullname,
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        this.areaService.create(body).subscribe(() => {
          this.isLoading = false;
          this.formGroup.reset();
          this.toastr.success('Zone ajouté avec succès!', 'Success!');
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
      const body: IArea = {
        name: this.formGroup.value.name,
        province: this.formGroup.value.province, 
        signature: this.currentUser.fullname,
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      this.areaService.update(this.idItem, body).subscribe(() => {
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
    this.areaService.get(this.idItem).subscribe(item => {
      this.dataItem = item.data;
      this.formGroup.patchValue({
        name: this.dataItem.name,
        province: this.dataItem.province,
      });
    });
  }


  delete(): void {
    this.isLoading = true;
    this.areaService.delete(this.idItem).subscribe(() => {
      this.formGroup.reset();
      this.toastr.info('Supprimé avec succès!', 'Success!');
      this.isLoading = false;
    });
  }

}


