import { Component, OnInit } from '@angular/core';
import { DashPlatProductService } from '../services/dash-plat-product.service';
import { CurrencyPipe, formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { routes } from '../../../shared/routes/routes';
import { IUser } from '../../../auth/models/user';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { Chart } from 'chart.js';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IClient } from '../../../models/client.model';

@Component({
  selector: 'app-dash-plat-product',
  templateUrl: './dash-plat-product.component.html',
  styleUrl: './dash-plat-product.component.scss'
})
export class DashPlatProductComponent implements OnInit {
  public routes = routes;
  loadUserData = false;

  currentUser!: IUser;
  isLoading = false;

  dateRange!: FormGroup;
  start_date!: string;
  end_date!: string;
  rangeDate: any[] = [];

  // Tables
  dataListTable: any[] = [];
  displayedColumnTables: string[] = ['CreatedAt', 'ncommande', 'TableBox', 'name', 'quantity', 'prix_vente', 'Client', 'pos', 'signature'];
  dataSourceTable = new MatTableDataSource<any>(this.dataListTable);
  totalItemTables: number = 0;
  pageSizeTable: number = 10;
  pageIndexTable: number = 0;
  lengthTable: number = 0;

  // Livraison
  dataListLivraison: any[] = [];
  displayedColumnLivraisons: string[] = ['CreatedAt', 'fullname', 'Area', 'name', 'quantity', 'prix_vente', 'name_society', 'livreur_name', 'cout_livraison', 'operator_name', 'pos'];
  dataSourceLivraison = new MatTableDataSource<any>(this.dataListLivraison);
  totalItemLivraisons: number = 0;
  pageSizeLivraison: number = 10;
  pageIndexLivraison: number = 0;
  lengthLivraison: number = 0;

  // Headers
  totalProduitVenduTable = 0;
  totalPlatVenduTable = 0;
  nombreTotalPlatVenduTable = 0;

  totalProduitVenduLivraison = 0;
  totalPlatVenduLivraison = 0;
  nombreTotalPlatVenduLivraison = 0;


  dataSaleProfits: any[] = [];
  dataStockDisponibles: any[] = []; // Produits en stock
  dataLivraisonPercentage: { 
    tablePercentage: number; 
    livraisonPercentage: number;
  } = { 
    tablePercentage: 0, 
    livraisonPercentage: 0 
  }; // Livraison Percentage
  dataLivraisonPieChartData: any[] = []; // Livraison Pie chart

  chart2: Chart | undefined;
  chart4: Chart | undefined;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private dashPlatProductService: DashPlatProductService,
    private currencyPipe: CurrencyPipe,) { }

  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }

  ngOnInit() {
    this.loadUserData = true;
    this.isLoading = true;
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.rangeDate = [firstDay, lastDay];

    this.dateRange = this._formBuilder.group({
      rangeValue: new FormControl(this.rangeDate),
    });
    this.start_date = formatDate(this.dateRange.value.rangeValue[0], 'yyyy-MM-dd', 'en-US');
    this.end_date = formatDate(this.dateRange.value.rangeValue[1], 'yyyy-MM-dd', 'en-US');

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;

        this.GetTotalPlatProductVendu(this.currentUser);
        this.GetVenteProfitPlatProductMonth(this.currentUser);
        // this.getStockDisponible(this.currentUser);
        this.GetTablePaginatedCmdLineSortieProductPlat(this.currentUser);
        this.GetLivraisonPaginatedCmdLineSortieProductPlat(this.currentUser);
        this.GetCommandeLineLivraisonPercentage(this.currentUser);
        this.GetCommandeLineLivraisonPieChartData(this.currentUser);


        // Appel de la méthode onChanges
        this.onChanges();

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

  onChanges(): void {
    this.dateRange.valueChanges.subscribe(val => {
      this.start_date = formatDate(val.rangeValue[0], 'yyyy-MM-dd', 'en-US');
      this.end_date = formatDate(val.rangeValue[1], 'yyyy-MM-dd', 'en-US');

      this.GetTotalPlatProductVendu(this.currentUser);
      this.GetVenteProfitPlatProductMonth(this.currentUser);
      // this.getStockDisponible(this.currentUser);
      this.GetTablePaginatedCmdLineSortieProductPlat(this.currentUser);
      this.GetLivraisonPaginatedCmdLineSortieProductPlat(this.currentUser);
      this.GetCommandeLineLivraisonPercentage(this.currentUser);
      this.GetCommandeLineLivraisonPieChartData(this.currentUser);

    });
  }

  onPageChangeTable(event: PageEvent): void {
    this.pageIndexTable = event.pageIndex
    this.pageSizeTable = event.pageSize
    this.GetTablePaginatedCmdLineSortieProductPlat(this.currentUser);
  }

  onPageChangeLivraison(event: PageEvent): void {
    this.pageIndexLivraison = event.pageIndex
    this.pageSizeLivraison = event.pageSize
    this.GetLivraisonPaginatedCmdLineSortieProductPlat(this.currentUser);
  }



  GetTotalPlatProductVendu(currentUser: IUser) {
    this.dashPlatProductService.GetTotalPlatProductVendu(
      currentUser.entreprise!.code!,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.totalProduitVenduTable = res.data.totalProduitVenduTable;
      this.totalPlatVenduTable = res.data.totalPlatVenduTable;
      this.nombreTotalPlatVenduTable = res.data.nombreTotalPlatVenduTable;

      this.totalProduitVenduLivraison = res.data.totalProduitVenduLivraison;
      this.totalPlatVenduLivraison = res.data.totalPlatVenduLivraison;
      this.nombreTotalPlatVenduLivraison = res.data.nombreTotalPlatVenduLivraison;
      this.isLoading = false;
    });
  }

  GetVenteProfitPlatProductMonth(currentUser: IUser) {
    this.dashPlatProductService.GetVenteProfitPlatProductMonth(
      currentUser.entreprise!.code!,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      console.log("dataSaleProfits", res.data);
      this.dataSaleProfits = res.data;
      this.dataSaleProfitcharts(this.dataSaleProfits);
      this.isLoading = false;
    });
  }

  // Tableau des sortie des plats et produits Table
  GetTablePaginatedCmdLineSortieProductPlat(currentUser: IUser) {
    this.dashPlatProductService.GetTablePaginatedCmdLineSortieProductPlat(
      currentUser.entreprise!.code!,
      this.pageIndexTable,
      this.pageSizeTable,
      this.start_date,
      this.end_date
    ).subscribe((res) => { 
      this.dataListTable = res.data;
      this.totalItemTables = res.pagination.total_pages;
      this.lengthTable = res.pagination.length;
      this.dataSourceTable = new MatTableDataSource<any>(this.dataListTable);
      this.isLoading = false;
    });
  }

  // Tableau des sortie des plats et produits Livraison
  GetLivraisonPaginatedCmdLineSortieProductPlat(currentUser: IUser) {
    this.dashPlatProductService.GetLivraisonPaginatedCmdLineSortieProductPlat(
      currentUser.entreprise!.code!,
      this.pageIndexLivraison,
      this.pageSizeLivraison,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.dataListLivraison = res.data;
      this.totalItemLivraisons = res.pagination.total_pages;
      this.lengthLivraison = res.pagination.length;
      this.dataSourceLivraison = new MatTableDataSource<any>(this.dataListLivraison);
      this.isLoading = false;
    });
  }

  // Taux de stock disponible pour les produits
  // getStockDisponible(currentUser: IUser) {
  //   this.dashPlatProductService.getStockDisponible(
  //     currentUser.entreprise!.code!,
  //     this.start_date,
  //     this.end_date
  //   ).subscribe((res) => {
  //     this.dataStockDisponibles = res.data;
  //     // this.pieschart(this.dataStockDisponibles);
  //     this.isLoading = false;
  //   });
  // }

  GetCommandeLineLivraisonPercentage(currentUser: IUser) {
    this.dashPlatProductService.GetCommandeLineLivraisonPercentage(
      currentUser.entreprise!.code!,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.dataLivraisonPercentage = res.data;
      this.isLoading = false;
    });
  }

  GetCommandeLineLivraisonPieChartData(currentUser: IUser) {
    this.dashPlatProductService.GetCommandeLineLivraisonPieChartData(
      currentUser.entreprise!.code!,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.dataLivraisonPieChartData = res.data; 
      this.pieschart(this.dataLivraisonPieChartData);
      this.isLoading = false;
    });
  }


  dataSaleProfitcharts(dataSaleProfits: any[]) {
    // Vérifier si un graphique existe déjà et le détruire
    this.chart2 = new Chart("MyChart", {
      type: 'line', // this denotes tha type of chart 
      data: {
        labels: dataSaleProfits.map((v) => v.mois),
        datasets: [
          {
            label: "Ventes",
            data: dataSaleProfits.map((v) => v.ventes),
            backgroundColor: 'blue'
          },
          {
            label: "Profits",
            data: dataSaleProfits.map((v) => v.profits),
            backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });
  }

  pieschart(dataLivraisonPieChartData: any[]) {
    this.chart4 = new Chart("doughcharts", {
      type: 'doughnut',
      data: {
        labels: Object.keys(dataLivraisonPieChartData).map((key: any) => key.toUpperCase()),
        datasets: [{
          data: Object.keys(dataLivraisonPieChartData).map((key: any) => dataLivraisonPieChartData[key]),
          // data: Object.keys(this.dataStockDisponibles).map((key: any) => ({
          //   "name": key,
          //   "value": this.dataStockDisponibles[key]
            // })),
          backgroundColor: Object.keys(dataLivraisonPieChartData).map((key: any) => {
            if (key == 'table') { 
              return '#FF5733'; // A nice shade of orange
            } else if (key == 'livraison') {
              return '#33FFCE'; // A nice shade of teal
            } 
            return '#000000'; // Default color
          }),
          // backgroundColor: [
          //   '#664dc9', '#44c4fa', '#38cb89', '#3e80eb', '#ffab00', '#ef4b4b'
          // ],
          borderWidth: 1
        }]
      },
    });
  }


}
