import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { IUser } from '../../auth/models/user';
import { routes } from '../../shared/routes/routes';
import { ILivraison } from '../../models/livraison.model';
import { LivraisonService } from './livraison.service';
import { IClient } from '../../models/client.model';
import { ILivreur } from '../../models/livreur.model';
import { IArea } from '../../models/area.model';
import { LivreurService } from '../livreurs/livreur.service';
import { ClientService } from '../clients/client.service';
import { AreaService } from '../area/area.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-livraisons',
  templateUrl: './livraisons.component.html',
  styleUrl: './livraisons.component.scss'
})
export class LivraisonsComponent implements OnInit, AfterViewInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes;

  // Table 
  dataList: ILivraison[] = [];
  totalItems: number = 0;
  pageSize: number = 15;
  pageIndex: number = 0;
  length: number = 0;

  // Table 
  displayedColumns: string[] = ['createdat', 'status', 'client', 'livreur', 'livreurname', 'areaprovince', 'areaname', 'adress', 'operator_name', 'pos', 'id'];
  dataSource = new MatTableDataSource<ILivraison>(this.dataList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public search = '';

  // Forms  
  idItem!: number;
  dataItem!: ILivraison; // Single data 

  formGroup!: FormGroup;
  currentUser!: IUser;
  isLoading = false;


  searchField = '';
  clientList: IClient[] = [];
  clientListFilter: IClient[] = [];
  filteredOptionsClient: IClient[] = [];
  totalItemsClient: number = 0;
  pageSizeClient: number = 15;
  pageIndexClient: number = 0;
  lengthClient: number = 0;
  @ViewChild('client_id') client_id!: ElementRef<HTMLInputElement>;
  clientId!: number;
  isloadClient = false;

  livreurList: ILivreur[] = [];
  livreurListFilter: ILivreur[] = [];
  filteredOptionsLivreur: ILivreur[] = [];
  totalItemsLivreur: number = 0;
  pageSizeLivreur: number = 15;
  pageIndexLivreur: number = 0;
  lengthLivreur: number = 0;
  @ViewChild('livreur_id') livreur_id!: ElementRef<HTMLInputElement>;
  livreurId!: number;
  isloadLivreur = false;

  areaList: IArea[] = [];
  areaListFilter: IArea[] = [];
  filteredOptionsArea: IArea[] = [];
  totalItemsArea: number = 0;
  pageSizeArea: number = 15;
  pageIndexArea: number = 0;
  lengthArea: number = 0;
  @ViewChild('area_id') area_id!: ElementRef<HTMLInputElement>;
  areaId!: number;
  isloadArea = false;


  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private livraisonService: LivraisonService,
    private livreurService: LivreurService,
    private clientService: ClientService,
    private areaService: AreaService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.livraisonService.refreshDataList$.subscribe(() => {
          this.fetchProducts(this.currentUser);
        });
        this.fetchProducts(this.currentUser);

        this.getAllClient(this.currentUser);
        this.getAllLivreur(this.currentUser);
        this.getAllArea(this.currentUser);
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
    this.isloadClient = true;
    this.isloadLivreur = true;
    this.isloadArea = true;
    this.formGroup = this._formBuilder.group({
      // client_id: ['', Validators.required],
      // livreur_id: ['', Validators.required],
      // area_id: ['', Validators.required],
      cout_livraison: ['', Validators.required],
      operator_name: ['', Validators.required],
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
      this.livraisonService.getPaginatedEntreprise(currentUser.entreprise?.code!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
        this.dataList = res.data;
        this.totalItems = res.pagination.total_pages;
        this.length = res.pagination.length;
        this.dataSource = new MatTableDataSource<ILivraison>(this.dataList);
        this.dataSource.sort = this.sort;

        this.isLoadingData = false;
      });
    } else {
      this.livraisonService.getPaginatedEntrepriseByPos(currentUser.entreprise?.code!, currentUser.pos?.ID!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
        this.dataList = res.data;
        this.totalItems = res.pagination.total_pages;
        this.length = res.pagination.length;
        this.dataSource = new MatTableDataSource<ILivraison>(this.dataList);
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


  getAllClient(currentUser: IUser): void { 
    const filterValue = this.client_id.nativeElement.value.toLowerCase();
    this.clientService.getPaginatedEntreprise(currentUser.entreprise?.code!, this.pageIndexClient, this.pageSizeClient, this.searchField).subscribe((res) => {
      this.clientList = res.data;
      this.clientListFilter = this.clientList;
      this.filteredOptionsClient = this.clientListFilter.filter(o => o.fullname.toLowerCase().includes(filterValue));
      this.totalItemsClient = res.pagination.total_pages;
      this.lengthClient = res.pagination.length;
      this.isloadClient = false;
    });
  }

  displayFnClient(client: any): any {
    return client && client.fullname ? client.fullname : '';
  }

  optionSelectedClient(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.value;
    this.clientId = selectedOption.ID;
  }

  getAllLivreur(currentUser: IUser): void { 
    const filterValue = this.livreur_id.nativeElement.value.toLowerCase();
    this.livreurService.getPaginatedEntreprise(currentUser.entreprise?.code!, this.pageIndexLivreur, this.pageSizeLivreur, this.searchField).subscribe((res) => {
      this.livreurList = res.data;
      this.livreurListFilter = this.livreurList;
      this.filteredOptionsLivreur = this.livreurListFilter.filter(o => o.livreur_name.toLowerCase().includes(filterValue));
      this.totalItemsLivreur = res.pagination.total_pages;
      this.lengthLivreur = res.pagination.length;
      this.isloadLivreur = false;
    });
  }

  displayFnLivreur(livreur: any): any {
    return livreur && livreur.livreur_name ? livreur.livreur_name : '';
  }

  optionSelectedLivreur(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.value; 
    this.livreurId = selectedOption.ID;
  }


  getAllArea(currentUser: IUser): void { 
    const filterValue = this.area_id.nativeElement.value.toLowerCase();
    this.areaService.getPaginatedEntreprise(currentUser.entreprise?.code!, this.pageIndexLivreur, this.pageSizeLivreur, this.searchField).subscribe((res) => {
      this.areaList = res.data;
      this.areaListFilter = this.areaList;
      this.filteredOptionsArea = this.areaListFilter.filter(o => o.name.toLowerCase().includes(filterValue));
      this.totalItemsArea = res.pagination.total_pages;
      this.lengthArea = res.pagination.length;
      this.isloadArea = false;
    });
  }

  displayFnArea(area: any): any {
    return area && area.name ? area.name : '';
  }

  optionSelectedArea(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.value; 
    this.areaId = selectedOption.ID; 
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body: ILivraison = {
          area_id: parseInt(this.areaId.toString()),
          cout_livraison: parseFloat(this.formGroup.value.cout_livraison),
          client_id: parseInt(this.clientId.toString()),
          livreur_id: parseInt(this.livreurId.toString()),
          operator_name: this.formGroup.value.operator_name,
          pos_id: parseInt(this.currentUser.pos!.ID!.toString()),
          status: 'En cours',
          signature: this.currentUser.fullname,
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        this.livraisonService.create(body).subscribe({
          next: (res) => {

            this.router.navigate(['/web/livraisons', res.data.ID, 'line']);  
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('livraison crée avec succès!', 'Success!');
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
      var body: ILivraison = {
        area_id: parseInt(this.areaId.toString()),
        cout_livraison: parseFloat(this.formGroup.value.cout_livraison),
        client_id: parseInt(this.clientId.toString()),
        livreur_id: parseInt(this.livreurId.toString()),
        operator_name: this.formGroup.value.operator_name,
        pos_id: parseInt(this.currentUser.pos!.ID!.toString()),
        status: 'En cours',
        signature: this.currentUser.fullname,
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      this.livraisonService.update(this.idItem, body)
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
    this.livraisonService.get(this.idItem).subscribe(item => {
      this.dataItem = item.data;
      this.formGroup.patchValue({
        operator_name: this.dataItem.operator_name,
        area_id: this.dataItem.area_id,
        cout_livraison: this.dataItem.cout_livraison,
        client_id: this.dataItem.client_id,
        livreur_id: this.dataItem.livreur_id,
      });
    }
    );
  }



  delete(): void {
    this.isLoading = true;
    this.livraisonService
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

