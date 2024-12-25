import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from '../../auth/auth.service';
import { routes } from '../../shared/routes/routes'; 
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Validators } from 'ngx-editor'; 
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator'; 
import { IUser } from '../../auth/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  public routes = routes;

  isLoading = false;
  isLoadingEdit = false;
  isLoadingChangePassword = false;

  isLoadingData = false;

  currentUser!: IUser;

  public searchLog = '';
  public searchPosForm = '';

  // Table 
  dataLogList: any[] = [];
  totalItemsLog: number = 0;
  pageSizeLog: number = 15;
  pageIndexLog: number = 0;
  lengthLog: number = 0;
  displayedColumnsLog: string[] = ['created', 'title', 'name', 'action', 'description'];
  dataSourceLog = new MatTableDataSource<any>(this.dataLogList);


  // Table 2
  dataPosFormList: any[] = [];
  totalItemsPosForm: number = 0;
  pageSizePosForm: number = 15;
  pageIndexPosForm: number = 0;
  lengthPosForm: number = 0; 
  displayedColumnsPosForm: string[] = ['eq', 'sold', 'dhl', 'ar', 'sbl', 'pmf', 'pmm', 'ticket', 'mtc', 'ws', 'mast', 'oris', 'elite', 'yes', 'time', 'province_id', 'area_id', 'sup_id', 'pos_id', 'comment'];
  dataSourcePosForm = new MatTableDataSource<any>(this.dataPosFormList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
 
  formGroup!: FormGroup;

  formGroupChangePassword!: FormGroup;

  public password: boolean[] = [false];

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService, 
    private toastr: ToastrService
  ) { }

  public togglePassword(index: number) {
    this.password[index] = !this.password[index]
  }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      fullname: [''],
      email: ['', Validators.required],
      telephone: [''],
    });

    this.formGroupChangePassword = this._formBuilder.group({
      old_password: ['', Validators.required],
      password: ['', Validators.required],
      password_confirm: ['', Validators.required],
    });

    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;

        console.log("currentUser", this.currentUser) 
       
        this.formGroup.patchValue({
          fullname: this.currentUser.fullname,
          email: this.currentUser.email,
          telephone: this.currentUser.telephone,
        });
  

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }


  onPageChangeLog(event: PageEvent): void {
    this.isLoadingData = true;
    this.pageIndexLog = event.pageIndex
    this.pageSizeLog = event.pageSize
    // this.fetchProductsLog(this.currentUser.ID);
  }

  // fetchProductsLog(id: number) {
  //   this.logsService.getPaginatedById(id, this.pageIndexLog, this.pageSizeLog, this.searchLog).subscribe(res => {
  //     this.dataLogList = res.data;
  //     this.totalItemsLog = res.pagination.total_pages;
  //     this.lengthLog = res.pagination.length;
  //     this.dataSourceLog = new MatTableDataSource<UserLogsModel>(this.dataLogList); 
  //     this.dataSourceLog.sort = this.sort;

  //     this.isLoadingData = false;
  //   });
  // }

  onSearchChangeLog(search: string) {
    this.searchLog = search;
    // this.fetchProductsLog(this.currentUser.id);
  }

  public sortDataLog(sort: Sort) {
    const data = this.dataLogList.slice();
    if (!sort.active || sort.direction === '') {
      this.dataLogList = data;
    } else {
      this.dataLogList = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
 
 
  onPageChangePosForm(event: PageEvent): void {
    this.isLoadingData = true;
    this.pageIndexLog = event.pageIndex
    this.pageSizeLog = event.pageSize
    // this.fetchProductsLog(this.currentUser.ID);
  }
 
  onSearchChangePosForm(search: string) {
    this.searchLog = search;
    // this.fetchProductsLog(this.currentUser.id);
  }

  public sortDataPosForm(sort: Sort) {
    const data = this.dataLogList.slice();
    if (!sort.active || sort.direction === '') {
      this.dataLogList = data;
    } else {
      this.dataLogList = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }


  onSubmitUpdate() {
    try {
      this.isLoadingEdit = true;
      var body = {
        fullname: this.formGroup.value.fullname,
        email: this.formGroup.value.email,
        telephone: this.formGroup.value.telephone,
        signature: this.currentUser.fullname,
      };
      this.authService.updateInfo(body).subscribe({
        next: () => {
          this.formGroup.reset();
          this.toastr.success('Modification enregistré!', 'Success!');
          this.isLoadingEdit = false;
        },
        error: err => {
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          this.isLoadingEdit = false;
        }
      });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  onSubmitChangePassword() {
    try {
      this.isLoadingChangePassword = true;
      var body = {
        old_password: this.formGroupChangePassword.value.old_password,
        password: this.formGroupChangePassword.value.password,
        password_confirm: this.formGroupChangePassword.value.password_confirm,
      };
      this.authService.updatePassword(body).subscribe({
        next: () => {
          this.authService.logout().subscribe(res => {
            this.formGroupChangePassword.reset();
            this.toastr.success('Mot de passe modifié!', 'Success!');
            this.isLoadingChangePassword = false;
            this.router.navigate(['/auth/login']);
          });
        },
        error: err => {
          console.log(err);
          this.toastr.error(`${err.error.message}`, 'Oupss!');
          this.isLoadingChangePassword = false;
        }
      });
    } catch (error) {
      this.isLoadingChangePassword = false;
      console.log(error);
    }
  }
}
