import { AfterViewInit, Component, OnInit } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { ICommande } from '../../../models/commande.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../../auth/models/user';
import { IClient } from '../../../models/client.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator'; 
import { PdfService } from '../../../shared/services/pdf.service';
import { ClientService } from '../../clients/client.service';
import { CommandeService } from '../commande.service';
import { CommandeLineService } from '../../commandes-lines/commande-line.service';
import { ICommandeLine } from '../../../models/commande_line.model';
import { Sort } from '@angular/material/sort';
import { ITableBox } from '../../../models/table-box.model';
import { TableBoxService } from '../../table-box/table-box.service';

@Component({
  selector: 'app-commande-card',
  templateUrl: './commande-card.component.html',
  styleUrl: './commande-card.component.scss'
})
export class CommandeCardComponent implements OnInit, AfterViewInit {
  loadUserData = false;
  isLoadingData = false;
  loading = false;
  public routes = routes;
  public sidebarPopup1 = false;
  public sidebarPopup2 = false;

  // Table 
  dataList: ICommande[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;
 
  public search = '';

  // Forms  
  idItem!: number;
  dataItem!: ICommande; // Single data 

  formGroup!: FormGroup;
  currentUser!: IUser;
  isLoading = false;

  tableId!: number;
  tableBox!: ITableBox;

  clientList: IClient[] = [];

  commandeLineList: ICommandeLine[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private commandeService: CommandeService,
    private clientService: ClientService,
    private commaneLineService: CommandeLineService,
    private tableBoxService: TableBoxService,
    private pdfService: PdfService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.commandeService.refreshDataList$.subscribe(() => {
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
    this.route.params.subscribe(routeParams => {
      this.tableId = routeParams['id'];
      this.getProduct(this.tableId);
    });

    this.formGroup = this._formBuilder.group({
      ncommande: ['', Validators.required],
      client_id: [''],
    });
  }

  
  // Get One commande
  getProduct(id: any) {
    this.tableBoxService.get(Number.parseInt(id)).subscribe(res => {
      this.tableBox = res.data;
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
    this.commandeService.getPaginatedCommandeByTableBox(currentUser.entreprise?.code!, currentUser.pos?.ID!, 
      this.tableId, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
      this.dataList = res.data;
      this.totalItems = res.pagination.total_pages;
      this.length = res.pagination.length; 

      this.clientService.getAllEntreprise(currentUser.entreprise?.code!).subscribe(re => {
        this.clientList = re.data;
      }); 
      this.isLoadingData = false;
    });
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


  onSubmit() {
    try {
      this.isLoading = true;
      const code = Math.floor(1000000000000 + Math.random() * 9999999999999);
      const body: ICommande = {
        ncommande: code,
        status: 'En cours',
        table_box_id: parseInt(this.tableId.toString()),
        signature: this.currentUser.fullname,
        pos_id: parseInt(this.currentUser.pos!.ID.toString()),
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      this.commandeService.create(body).subscribe((res) => {
        const body: ITableBox = {
          name: this.formGroup.value.name,
          numero: parseInt(this.formGroup.value.numero.toString()),
          status: 'Occuper',
          signature: this.currentUser.fullname,
          pos_id: parseInt(this.currentUser.pos!.ID.toString()),
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        this.tableBoxService.update(this.tableId, body).subscribe(() => {
          this.isLoading = false;
          this.toastr.success('Commande crée avec succès!', 'Success!');
          this.router.navigate(['/web/table-box/commandes', res.data.ID, 'line']);
        });
      });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }



  findValue(value: number) {
    this.idItem = value;
    this.commandeService.get(this.idItem).subscribe(item => {
      this.dataItem = item.data;
      this.formGroup.patchValue({
        ncommande: this.dataItem.ncommande,
        status: this.dataItem.status,
        table_box_id: this.dataItem.table_box_id,
        client_id: this.dataItem.client_id,
      }); 
      this.commaneLineService.getAllById(this.dataItem!.ID!).subscribe((line) => {
        this.commandeLineList = line.data;  
      });
    });
  }



  delete(): void {
    this.isLoading = true;
    const dataL = this.dataList.filter((v) => v.status === 'En cours');
    if (dataL.length === 1) {
      const body: ITableBox = {
        name: this.tableBox.name,
        numero: parseInt(this.tableBox.numero.toString()),
        status: 'Libre',
        signature: this.currentUser.fullname,
        pos_id: parseInt(this.currentUser.pos!.ID.toString()),
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      this.tableBoxService.update(this.tableId, body).subscribe(() => {
        this.commandeService.delete(this.idItem).subscribe(() => {
          this.formGroup.reset();
          this.toastr.info('Supprimé avec succès!', 'Success!');
          this.isLoading = false;
        });
      });
    } else {
      this.commandeService.delete(this.idItem).subscribe(() => {
        this.formGroup.reset();
        this.toastr.info('Supprimé avec succès!', 'Success!');
        this.isLoading = false;
      });  
    }
  }
  generatePdf() {
    this.pdfService.generateInvoice(this.commandeLineList);
  }

}

