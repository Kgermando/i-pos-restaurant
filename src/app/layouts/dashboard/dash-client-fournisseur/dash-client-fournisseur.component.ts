import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IUser } from '../../../auth/models/user';
import { routes } from '../../../shared/routes/routes';
import { Chart } from 'chart.js';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { CurrencyPipe, formatDate } from '@angular/common';
import { DashClientFournisseurLivraisonService } from '../services/dash-client-fournisseur-livraison.service';

@Component({
  selector: 'app-dash-client-fournisseur',
  templateUrl: './dash-client-fournisseur.component.html',
  styleUrl: './dash-client-fournisseur.component.scss'
})
export class DashClientFournisseurComponent implements OnInit {
  public routes = routes;
  loadUserData = false;

  currentUser!: IUser;
  isLoading = false;

  // dateRange!: FormGroup;
  // start_date!: string;
  // end_date!: string;
  // rangeDate: any[] = [];

  // Clients
  dataListClient: any[] = [];
  displayedColumnClients: string[] = ['fullname', 'telephone', 'email', 'count'];
  dataSourceClient = new MatTableDataSource<any>(this.dataListClient);

  // Fournisseurs
  dataListFournisseur: any[] = [];
  displayedColumnFournisseurs: string[] = ['name', 'telephone', 'type_fourniture', 'total_value'];
  dataSourceFournisseur = new MatTableDataSource<any>(this.dataListFournisseur);
  
  // Headers
  nombreTotalClient = 0;
  nombreTotalFournisseur = 0;
  nombreTotalArea = 0;

  chart4: Chart | undefined;

  piechartZone: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private dashClientFournisseurLivraisonService: DashClientFournisseurLivraisonService) { }

  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }


  ngOnInit() {
    this.loadUserData = true;
    this.isLoading = true;
    // const date = new Date();
    // const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // this.rangeDate = [firstDay, lastDay];

    // this.dateRange = this._formBuilder.group({
    //   rangeValue: new FormControl(this.rangeDate),
    // });
    // this.start_date = formatDate(this.dateRange.value.rangeValue[0], 'yyyy-MM-dd', 'en-US');
    // this.end_date = formatDate(this.dateRange.value.rangeValue[1], 'yyyy-MM-dd', 'en-US');

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;

        this.GetTotalClientFournisseur(this.currentUser);
        this.GetCourbeZoneLivraison(this.currentUser);
        this.GetClientsWithMostDeliveries(this.currentUser);
        this.GetTop10FournisseursWithMostStockValue(this.currentUser);


        // Appel de la méthode onChanges
        // this.onChanges();

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

  // onChanges(): void {
  //   this.dateRange.valueChanges.subscribe(val => {
  //     this.start_date = formatDate(val.rangeValue[0], 'yyyy-MM-dd', 'en-US');
  //     this.end_date = formatDate(val.rangeValue[1], 'yyyy-MM-dd', 'en-US');

  //     this.GetTotalClientFournisseur(this.currentUser);
  //     this.GetCourbeZoneLivraison(this.currentUser);
  //     this.GetClientsWithMostDeliveries(this.currentUser);
  //     this.GetTop10FournisseursWithMostStockValue(this.currentUser);

  //   });
  // }


  GetTotalClientFournisseur(currentUser: IUser) {
    this.dashClientFournisseurLivraisonService.GetTotalClientFournisseur(
      currentUser.entreprise!.code!,
    ).subscribe((res) => {
      this.nombreTotalClient = res.data.client;
      this.nombreTotalFournisseur = res.data.fournisseur;
      this.nombreTotalArea = res.data.area;

      this.isLoading = false;
    });
  }


  GetCourbeZoneLivraison(currentUser: IUser) {
    this.dashClientFournisseurLivraisonService.GetCourbeZoneLivraison(
      currentUser.entreprise!.code!
    ).subscribe((res) => {
      this.piechartZone = res.data.piechart;
      this.pieschart(this.piechartZone);
      this.isLoading = false;
    });
  }

  GetClientsWithMostDeliveries(currentUser: IUser) {
    this.dashClientFournisseurLivraisonService.GetClientsWithMostDeliveries(
      currentUser.entreprise!.code!
    ).subscribe((res) => {
      console.log("dataListClient", res.data);
      this.dataListClient = res.data;
      this.dataSourceClient = new MatTableDataSource<any>(this.dataListClient);
      this.isLoading = false;
    });
  }

  GetTop10FournisseursWithMostStockValue(currentUser: IUser) {
    this.dashClientFournisseurLivraisonService.GetTop10FournisseursWithMostStockValue(
      currentUser.entreprise!.code!
    ).subscribe((res) => {
      console.log("dataSourceFournisseur", res.data);
      this.dataListFournisseur = res.data;
      this.dataSourceFournisseur = new MatTableDataSource<any>(this.dataListFournisseur);
      this.isLoading = false;
    });
  }

  pieschart(piechartZone: any[]) {
    this.chart4 = new Chart("doughcharts", {
      type: 'doughnut',
      data: {
        labels: piechartZone.map((v: any) => v.area_name),
        datasets: [{
          data: piechartZone.map((v: any) => v.count),
          backgroundColor: [
            '#664dc9', '#FF5733', '#44c4fa', '#38cb89', '#33FFCE', '#3e80eb', '#ffab00', '#ef4b4b'
          ],
          borderWidth: 1
        }]
      },
    });
  }

}
