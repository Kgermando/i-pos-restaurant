import { AfterViewInit, Component, OnInit, signal, ViewChild } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { IPlat } from '../../../models/plat.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../../auth/models/user';
import { uniteVentes } from '../../../utils/unite_vente_et_monnaie';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CurrencyPipe } from '@angular/common';
import { PlatService } from '../plat.service';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-plat-card',
  templateUrl: './plat-card.component.html',
  styleUrl: './plat-card.component.scss'
})
export class PlatCardComponent implements OnInit, AfterViewInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes; 

  // Table 
  dataList: IPlat[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;

  public search = '';


  // Forms  
  idItem!: number;
  dataItem!: IPlat; // Single data 

  formGroup!: FormGroup;
  currentUser!: IUser;
  isLoading = false;

  uniteVenteList: string[] = uniteVentes;

  reference = '';
  isScan = false;

  @ViewChild('scanner', { static: false })
  scanner!: ZXingScannerComponent;

  availableDevices!: MediaDeviceInfo[];
  currentDevice!: MediaDeviceInfo;
  torch = false;

  // Utilisation des formats BarcodeFormat
  formats = [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.CODE_39, BarcodeFormat.EAN_13];

  qty = 80;
  totalStockQty = 0;
  totalCmdQty = 0;
  totalQtyRest = 0;

  pourcentQty = signal<number>(100);
  qtyDispo = signal<number>(0);

  prix = signal<number>(3000);
  profit = signal<number>(0);


  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private platService: PlatService, 
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.platService.refreshDataList$.subscribe(() => {
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
      description: ['', Validators.required],
      unite_vente: ['', Validators.required],
      prix_vente: ['', Validators.required],
      tva: ['', Validators.required],
    });

    // Obtenir tous les appareils disponibles (caméras)
    navigator.mediaDevices.enumerateDevices().then((devices: MediaDeviceInfo[]) => {
      this.availableDevices = devices.filter(device => device.kind === 'videoinput');
      // Sélectionner le premier appareil par défaut
      if (this.availableDevices && this.availableDevices.length > 0) {
        this.currentDevice = this.availableDevices[0];
      }
    }).catch(err => {
      console.error("Erreur lors de la récupération des appareils:", err);
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
      this.platService.getPaginatedEntreprise(currentUser.entreprise?.code!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
        this.dataList = res.data;
        this.totalItems = res.pagination.total_pages;
        this.length = res.pagination.length;

        this.isLoadingData = false;
      });
    } else {
      this.platService.getPaginatedEntrepriseByPos(currentUser.entreprise?.code!, currentUser.pos?.ID!, this.pageIndex, this.pageSize, this.search).subscribe((res) => {
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
 

  onReferenceGenCode() {
    const code = Math.floor(1000000000000 + Math.random() * 9999999999999);
    this.reference = code.toString();
    this.isScan = false;
  }

  onReferenceReset() {
    this.reference = '';
    this.isScan = false;
  }

  onReferenceScanner() {
    this.isScan = true;
  }

  processCode(scannedId: string): void {
    if (!scannedId || this.reference) {
      return;
    }

    this.reference = scannedId;

    console.log('Code barre scanné :', this.reference);
  }
 

  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        const body: IPlat = {
          reference: this.reference,
          name: this.formGroup.value.name,
          description: this.formGroup.value.description,
          unite_vente: this.formGroup.value.unite_vente,
          prix_vente: this.formGroup.value.prix_vente,
          tva: this.formGroup.value.tva,
          signature: this.currentUser.fullname,
          pos_id: parseInt(this.currentUser.pos!.ID!.toString()),
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        this.platService.create(body).subscribe(() => {
          this.isLoading = false;
          this.formGroup.reset();
          this.reference = ''; 
          this.toastr.success('Produit ajouté avec succès!', 'Success!');
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
      const body: IPlat = {
        reference: this.reference,
        name: this.formGroup.value.name,
        description: this.formGroup.value.description,
        unite_vente: this.formGroup.value.unite_vente,
        prix_vente: this.formGroup.value.prix_vente,
        tva: this.formGroup.value.tva,
        signature: this.currentUser.fullname,
        pos_id: parseInt(this.currentUser.pos!.ID!.toString()),
        code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
      };
      this.platService.update(this.idItem, body).subscribe(() => {
        this.formGroup.reset();
        this.reference = '';
        this.toastr.success('Modification enregistré!', 'Success!');
        this.isLoading = false;
      }); 
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }


  findValue(value: number) {
    this.idItem = value;
    this.platService.get(this.idItem).subscribe(item => {
      this.dataItem = item.data;
      this.reference = this.dataItem.reference;
      this.formGroup.patchValue({
        reference: this.dataItem.reference,
        name: this.dataItem.name,
        description: this.dataItem.description,
        unite_vente: this.dataItem.unite_vente,
        prix_vente: this.dataItem.prix_vente,
        tva: this.dataItem.tva,
      });
    });
  }


  delete(): void {
    this.isLoading = true;
    this.platService.delete(this.idItem).subscribe(() => {
      this.formGroup.reset(); 
      this.reference = '';
      this.toastr.info('Supprimé avec succès!', 'Success!');
      this.isLoading = false;
    }); 
  }

}
