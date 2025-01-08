import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IClient } from '../../../models/client.model';
import { routes } from '../../../shared/routes/routes';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../../auth/models/user';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../client.service';
import { Papa } from 'ngx-papaparse';
import { formatDate } from '@angular/common';
import { parseDate } from 'ngx-bootstrap/chronos';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CsvService } from '../../../shared/services/csv.service';

@Component({
  selector: 'app-client-table',
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.scss'
})
export class ClientTableComponent implements OnInit, AfterViewInit {
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

  // Table 
  displayedColumns: string[] = ['fullname', 'telephone', 'telephone2', 'email', 'adress', 'birthday', 'organisation', 'website', 'action', 'id'];
  dataSource = new MatTableDataSource<IClient>(this.dataList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public search = '';

  // Forms  
  idItem!: number;
  dataItem!: IClient; // Single data 

  formGroup!: FormGroup;
  currentUser!: IUser;
  isLoading = false;

  clientList: IClient[] = []; // File uploaded
  progress = 0;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private clientService: ClientService,
    private csvService: CsvService, 
    private toastr: ToastrService,
    private papa: Papa
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
      telephone2: [''],
      email: [''],
      adress: [''],
      birthday: [''],
      organisation: [''],
      website: [''],
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
        this.dataSource = new MatTableDataSource<IClient>(this.dataList);
        this.dataSource.sort = this.sort;

        this.isLoadingData = false;
      });
    } else {
      this.clientService.getPaginatedEntrepriseByPos(currentUser.entreprise?.code!, currentUser.pos?.ID!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
        this.dataList = res.data;
        this.totalItems = res.pagination.total_pages;
        this.length = res.pagination.length;
        this.dataSource = new MatTableDataSource<IClient>(this.dataList);
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
        const body: IClient = {
          fullname: this.formGroup.value.fullname,
          telephone: this.formGroup.value.telephone,
          telephone2: this.formGroup.value.telephone2,
          email: this.formGroup.value.email,
          adress: this.formGroup.value.adress,
          birthday: formatDate(parseDate(this.formGroup.value.birthday), 'yyyy-MM-dd', 'en-US'),
          organisation: this.formGroup.value.organisation,
          website: this.formGroup.value.website,
          signature: this.currentUser.fullname,
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        this.clientService.create(body).subscribe(() => {
          this.isLoading = false;
          this.formGroup.reset();
          this.toastr.success('Client ajouté avec succès!', 'Success!');
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
        telephone2: this.formGroup.value.telephone2,
        email: this.formGroup.value.email,
        adress: this.formGroup.value.adress,
        birthday: formatDate(parseDate(this.formGroup.value.birthday), 'yyyy-MM-dd', 'en-US'),
        organisation: this.formGroup.value.organisation,
        website: this.formGroup.value.website,
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
        telephone2: this.dataItem.telephone2,
        email: this.dataItem.email,
        adress: this.dataItem.adress,
        birthday: this.dataItem.birthday,
        organisation: this.dataItem.organisation,
        website: this.dataItem.website,
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


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.csvService.parseCsv(file).then(data => { 
        this.clientService.uploadCsvData(data, parseInt(this.currentUser.entreprise!.code.toString()), this.currentUser.fullname).subscribe(progress => {
          this.progress = progress;
        });
      }).catch(error => {
        console.error('Erreur lors de la lecture du fichier CSV', error);
      });
    }
  }


  // async upload(event: any) {
  //   const file = event.target.files[0];
  //   if (this.isValidCSVFile(file)) {
  //     this.isLoading = true;
  //     this.papa.parse(file, {
  //       worker: true,
  //       header: true,
  //       delimiter: ';',
  //       skipEmptyLines: true,
  //       // encoding: 'utf-8',
  //       complete: (results) => {
  //         this.clientList = results.data;
  //         if (this.clientList.length > 1000) {
  //           this.isLoading = false;
  //           this.toastr.info('Veuillez reduire les lignes en dessous de 1000.', 'Success!');
  //         } else {
  //           for (let index = 0; index < this.clientList.length; index++) {
  //             const body: IClient = {
  //               fullname: this.clientList[index].fullname,
  //               telephone: this.clientList[index].telephone,
  //               telephone2: this.clientList[index].telephone2,
  //               email: this.clientList[index].email,
  //               adress: this.clientList[index].adress,
  //               birthday: formatDate(parseDate(this.clientList[index].birthday!), 'yyyy-MM-dd', 'en-US'),
  //               organisation: this.clientList[index].organisation,
  //               website: this.clientList[index].website,
  //               signature: this.currentUser.fullname,
  //               code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
  //             };
  //             this.clientService.create(body).subscribe({
  //               next: () => { 
  //                 var pourcents = (index + 1) * 100 / this.clientList.length;
  //                 this.pourcent = parseInt(pourcents.toFixed(0));
  //                 if (this.pourcent == 100) {  
  //                   this.isLoading = false;
  //                   console.log("All done!");
  //                   this.toastr.success('Importation effectuée avec succès!', 'Success!');
  //                 }
  //               },
  //               error: (err) => { 
  //                 this.isLoading = false;
  //                 this.toastr.error(`${err.error.message}`, 'Oupss!');
  //                 console.log(err); 
  //               }
  //             });
  //           }
  //         } 
  //       },
  //       error: (error, file) => { 
  //         this.toastr.error(`${error}`, 'Oupss!');
  //         console.log(error);
  //         console.log("file", file);
  //         // this.close();
  //       },
  //     });
  //   } else {  
  //     alert("Please import valid .csv file."); 
  //   }      
  // }
 
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }
 

  downloadModelReport() {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const url = '/xlsx/model-report.xlsx';
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const file = new Blob([blob], { type: EXCEL_TYPE });
        FileSaver.saveAs(file, 'model-report' + EXCEL_EXTENSION);
      })
      .catch(error => {
        console.error('Error downloading the file', error);
        this.toastr.error('Erreur lors du téléchargement du fichier', 'Erreur');
      });
  }
}

