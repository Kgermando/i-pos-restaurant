import { Component, OnInit } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../../auth/models/user'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CurrencyPipe } from '@angular/common'; 
import { ToastrService } from 'ngx-toastr';
import { ICaisse } from '../../../models/caisse.model';
import { CaisseService } from './caisse.service';


@Component({
  selector: 'app-caisse',
  templateUrl: './caisse.component.html',
  styleUrl: './caisse.component.scss'
})
export class CaisseComponent implements OnInit {
  loadUserData = false;
  isLoadingData = false;
  
  public routes = routes;

  dataList: ICaisse[] = [];
  caisseID!: number; 

  formGroupCaisse!: FormGroup; // Caisse
  currentUser!: IUser;
  isLoading = false;   
  isLoadingCaisse = false; 

  total = 0;
  totalEntree = 0;
  totalSortie = 0;
  solde = 0;
  pourcent = 0;

  public appSidebar = true;

  toggleChange() {
    this.appSidebar = !this.appSidebar;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private _formBuilder: FormBuilder, 
    private currencyPipe: CurrencyPipe,
    private caisseService: CaisseService,
    private toastr: ToastrService
  ) { }

  

  ngOnInit() {
    this.loadUserData = true;
    this.isLoadingData = true;  
    this.formGroupCaisse = this._formBuilder.group({ 
      name: ['', Validators.required], 
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.caisseService.refreshDataList$.subscribe(() => {
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
 

  fetchProducts(currentUser: IUser) {
    if (currentUser.role === 'Manager général' ||
      currentUser.role === 'Support') {
      this.caisseService.getAllEntreprise(currentUser.entreprise?.code!).subscribe((res) => {
        this.dataList = res.data;
        this.isLoadingData = false;
      });
    } else {
      this.caisseService.getAllEntreprisePos(currentUser.entreprise?.code!, currentUser.pos?.ID!).subscribe((res) => {
        this.dataList = res.data;
        this.isLoadingData = false;
      });
    }
    this.GetTotalAllCaisses(currentUser);
  }

  getCaisseID(id: number) {
    this.caisseID = id;
    console.log("caisseID");
  }

  GetTotalAllCaisses(currentUser: IUser) {
    this.caisseService.GetTotalAllCaisses(currentUser.entreprise?.code!).subscribe((res) => {
      this.total = res.data.total;
      this.totalEntree = res.data.totalentree;
      this.totalSortie = res.data.totalsortie;
      this.solde = res.data.solde;
      this.pourcent = res.data.pourcent; 
    });
  }


  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }


  newCaisse() {
    try {
      if (this.formGroupCaisse.valid) {
        this.isLoadingCaisse = true;
        const body: ICaisse = {
          name: this.formGroupCaisse.value.name,
          signature: this.currentUser.fullname,
          pos_id: parseInt(this.currentUser.pos!.ID!.toString()),
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        this.caisseService.create(body).subscribe((res) => {
          this.isLoadingCaisse = false;
          this.formGroupCaisse.reset();
          this.toastr.success(`Caisse ${res.data.type_transaction} ajoutée avec succès!`, 'Success!');
        });
      }
    } catch (error) {
      this.isLoadingCaisse = false;
      console.log(error);
    }
  }

  editCaisse() {
    try {
      if (this.formGroupCaisse.valid) {
        this.isLoadingCaisse = true;
        const body: ICaisse = {
          name: this.formGroupCaisse.value.name,
          signature: this.currentUser.fullname,
          pos_id: parseInt(this.currentUser.pos!.ID!.toString()),
          code_entreprise: parseInt(this.currentUser.entreprise!.code.toString()),
        };
        this.caisseService.update(this.caisseID, body).subscribe((res) => {
          this.isLoadingCaisse = false;
          this.formGroupCaisse.reset();
          this.toastr.success(`Caisse ${res.data.type_transaction} crée avec succès!`, 'Success!');
        });
      }
    } catch (error) {
      this.isLoadingCaisse = false;
      console.log(error);
    }
  }



  delete(): void {
    this.isLoading = true;
    this.caisseService.delete(this.caisseID).subscribe(() => {
      this.formGroupCaisse.reset(); 
      this.toastr.info('Supprimé avec succès!', 'Success!');
      this.isLoading = false;
    });
  }
 
 
}

