import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { routes } from '../../shared/routes/routes';
import { IUser } from '../../auth/models/user';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IPos } from '../../models/pos.model';
import { CurrencyPipe, formatDate } from '@angular/common';
import { PosService } from '../pos/pos.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { IStock } from '../../models/stock.model';
import { ICommandeLine } from '../../models/commande_line.model';
import { DashboardService } from './dashboard.service';
import { PageEvent } from '@angular/material/paginator';
import { Chart, registerables } from 'chart.js';

export interface ChartOptions {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  xaxis: ApexXAxis | any;
  legend: ApexLegend | any;
}


Chart.register(...registerables)


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  public routes = routes;
  loadUserData = false;

  totalItemsEntree: number = 0;
  pageSizeEntree: number = 10;
  pageIndexEntree: number = 0;
  lengthEntree: number = 0;

  totalItemsSortie: number = 0;
  pageSizeSortie: number = 10;
  pageIndexSortie: number = 0;
  lengthSortie: number = 0;

  currentUser!: IUser;
  isLoading = false;


  dateRange!: FormGroup;
  start_date!: string;
  end_date!: string;


  // Filtre 
  load = false;
  rangeDate: any[] = [];
  posDropdownList: IPos[] = [];
  posDropdown!: IPos;


  // SUMMARY
  TotalProductStock = 0;
  TotalProfitDispos = 0;
  TotalProfitSorties = 0;
  TatalValeurProducts = 0;


  // Tableau des entrees et sorties
  dataListEntree: IStock[] = [];
  dataListSortie: ICommandeLine[] = [];


  dataEntreSortiePie: any[] = [];
  dataSaleProfits: any[] = [];
  dataStockDisponibles: any[] = [];

  courbeVente24hList: any[] = [];
  totalVente24h = 0;

  chart1: Chart | undefined;
  chart2: Chart | undefined;
  chart3: Chart | any;
  chart4: Chart | undefined;

  // @ViewChild('chart') chart!: ChartComponent;
  public chartOptions4: Partial<ChartOptions> | any;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private posService: PosService,
    private currencyPipe: CurrencyPipe,
  ) { }

  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }



  onChanges(): void {
    this.dateRange.valueChanges.subscribe(val => {
      this.start_date = formatDate(val.rangeValue[0], 'yyyy-MM-dd', 'en-US');
      this.end_date = formatDate(val.rangeValue[1], 'yyyy-MM-dd', 'en-US');

      this.getPosList(this.currentUser);
      this.getDataListEntree(this.currentUser);
      this.getDataListSortie(this.currentUser);
      this.getEntreeSortie(this.currentUser);
      this.getSaleProfit(this.currentUser);
      this.getStockDisponible(this.currentUser);
      this.getTotalProductInStock(this.currentUser);
      this.getTotalStockDispoSortie(this.currentUser);
      this.getTotalValeurProduct(this.currentUser);
      this.getCourbeVente24h(this.currentUser);
      this.getTotalVente24h(this.currentUser);
    });
  }

  ngOnInit(): void {
    this.loadUserData = true;
    this.isLoading = true;
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.rangeDate = [firstDay, lastDay];

    this.dateRange = this._formBuilder.group({
      pos: new FormControl(this.posDropdown),
      rangeValue: new FormControl(this.rangeDate),
      // area: new FormControl(''),
    });
    this.start_date = formatDate(this.dateRange.value.rangeValue[0], 'yyyy-MM-dd', 'en-US');
    this.end_date = formatDate(this.dateRange.value.rangeValue[1], 'yyyy-MM-dd', 'en-US');

    // console.log("start_date", this.start_date);
    // console.log("end_date", this.end_date);

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.getPosList(this.currentUser);
        this.getDataListEntree(this.currentUser);
        this.getDataListSortie(this.currentUser);
        this.getEntreeSortie(this.currentUser);
        this.getSaleProfit(this.currentUser);
        this.getStockDisponible(this.currentUser);
        this.getTotalProductInStock(this.currentUser);
        this.getTotalStockDispoSortie(this.currentUser);
        this.getTotalValeurProduct(this.currentUser);
        this.getCourbeVente24h(this.currentUser);
        this.getTotalVente24h(this.currentUser);

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

  ngOnDestroy(): void {
    // Détruire le graphique lorsque le composant est détruit
    if (this.chart1) {
      this.chart1.destroy();
    }
    if (this.chart2) {
      this.chart2.destroy();
    }
    if (this.chart3) {
      this.chart3.destroy();
    }
    if (this.chart4) {
      this.chart4.destroy();
    }
  }




  onPageChangeEntree(event: PageEvent): void {
    this.pageIndexEntree = event.pageIndex
    this.pageSizeEntree = event.pageSize
    this.getDataListEntree(this.currentUser);
    this.getDataListSortie(this.currentUser);
  }

  onPageChangeSortie(event: PageEvent): void {
    this.pageIndexSortie = event.pageIndex
    this.pageSizeSortie = event.pageSize
    this.getDataListEntree(this.currentUser);
    this.getDataListSortie(this.currentUser);
  }


  getPosList(currentUser: IUser) {
    this.load = true;
    this.posService.getAllById(currentUser.entreprise!.ID!).subscribe((res) => {
      this.posDropdownList = res.data;
      this.load = false;
    });
  }


  getDataListEntree(currentUser: IUser) {
    this.dashboardService.getDashboardStock(
      currentUser.entreprise!.code!,
      this.pageIndexEntree,
      this.pageSizeEntree,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.dataListEntree = res.data;
      this.totalItemsEntree = res.pagination.total_pages;
      this.lengthEntree = res.pagination.length;
      this.isLoading = false;
    });
  }

  getDataListSortie(currentUser: IUser) {
    this.dashboardService.getDashboardCommandeLine(
      currentUser.entreprise!.code!,
      this.pageIndexSortie,
      this.pageSizeSortie,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.dataListSortie = res.data;
      this.totalItemsSortie = res.pagination.total_pages;
      this.lengthSortie = res.pagination.length;
      this.isLoading = false;
    });
  }


  getEntreeSortie(currentUser: IUser) {
    this.dashboardService.getEntreeSortie(
      currentUser.entreprise!.code!,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.dataEntreSortiePie = res.data;
      this.stackchart();
      this.isLoading = false;
    });
  }

  getSaleProfit(currentUser: IUser) {
    this.dashboardService.getSaleProfit(
      currentUser.entreprise!.code!,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.dataSaleProfits = res.data;
      this.areacharts();
      this.isLoading = false;
    });
  }

  getStockDisponible(currentUser: IUser) {
    this.dashboardService.getStockDisponible(
      currentUser.entreprise!.code!,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.dataStockDisponibles = res.data;
      this.doughcharts();
      this.RenderChart();
      this.isLoading = false;
    });
  }

  getTotalProductInStock(currentUser: IUser) {
    this.dashboardService.getTotalProductInStock(
      currentUser.entreprise!.code!,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.TotalProductStock = res.data;
      this.doughcharts();
      this.RenderChart();
      this.isLoading = false;
    });
  }

  getTotalStockDispoSortie(currentUser: IUser) {
    this.dashboardService.getTotalStockDispoSortie(
      currentUser.entreprise!.code!,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.TotalProfitDispos = res.data.total_profit_available_stock;
      this.TotalProfitSorties = res.data.total_profit_stock_in_out;
      this.isLoading = false;
    });
  }


  getTotalValeurProduct(currentUser: IUser) {
    this.dashboardService.getTotalValeurProduct(
      currentUser.entreprise!.code!,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.TatalValeurProducts = res.data;
      this.isLoading = false;
    });
  }

  getCourbeVente24h(currentUser: IUser) {
    this.dashboardService.getCourbeVente24h(
      currentUser.entreprise!.code!
    ).subscribe((res) => {
      this.courbeVente24hList = res.data;
      this.getCourbeVente24hLineChart();
      this.isLoading = false;
    });
  }

  getTotalVente24h(currentUser: IUser) {
    this.dashboardService.getTotalVente24h(
      currentUser.entreprise!.code!
    ).subscribe((res) => {
      this.totalVente24h = res.data; 
      this.isLoading = false;
    });
  }


  stackchart() {
    // Vérifier si un graphique existe déjà et le détruire
    if (this.chart1) {
      this.chart1.destroy();
    }

    this.chart1 = new Chart("stackcharts", {
      type: 'bar',
      data: {
        labels: this.dataEntreSortiePie.map((v) => v.product),
        datasets: [
          {
            label: "Entrée",
            data: this.dataEntreSortiePie.map((v) => v.stock_in),
            backgroundColor: '#664dc9'
          },
          {
            label: "Sortie",
            data: this.dataEntreSortiePie.map((v) => v.stock_out),
            backgroundColor: '#3e80eb'
          }
        ]
      },
      options: {
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2,
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Mouvements sur la Quantité des produits'
          }
        }
      },
    });
  }



  areacharts() {
    // Vérifier si un graphique existe déjà et le détruire
    if (this.chart2) {
      this.chart2.destroy();
    }

    this.chart2 = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        // labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        labels: this.dataSaleProfits.map((v) => v.mois),
        datasets: [
          {
            label: "Ventes",
            data: this.dataSaleProfits.map((v) => v.ventes),
            backgroundColor: 'blue'
          },
          {
            label: "Profits",
            data: this.dataSaleProfits.map((v) => v.profits),
            backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });
  }


  doughcharts() {
    // Vérifier si un graphique existe déjà et le détruire
    if (this.chart3) {
      this.chart3.destroy();
    }

    this.chart3 = new Chart("doughcharts", {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.dataStockDisponibles).map((key: any) => key),
        datasets: [{
          data: Object.keys(this.dataStockDisponibles).map((key: any) => this.dataStockDisponibles[key]),
          // data: Object.keys(this.dataStockDisponibles).map((key: any) => ({
          //   "name": key,
          //   "value": this.dataStockDisponibles[key]
          // })),
          backgroundColor: [
            '#664dc9', '#44c4fa', '#38cb89', '#3e80eb', '#ffab00', '#ef4b4b'
          ],
          borderWidth: 1
        }]
      },
    });
  }

  RenderChart() {
    // Vérifier si un graphique existe déjà et le détruire
    if (this.chart4) {
      this.chart4.destroy();
    }

    this.chart4 = new Chart("pieschart", {
      type: 'bar',
      data: {
        labels: Object.keys(this.dataStockDisponibles).map((key: any) => key),
        datasets: [{
          label: 'Stocks actuel',
          data: Object.keys(this.dataStockDisponibles).map((key: any) => this.dataStockDisponibles[key]),
          backgroundColor: [
            ' #0dcaf0'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


  getCourbeVente24hLineChart() {
    this.chartOptions4 = {
      series: [
        {
          name: 'Ventes journalières',
          data: Object.keys(this.courbeVente24hList).map((key: any) => this.courbeVente24hList[key]),
        },
      ],
      chart: {
        height: 273,
        type: 'area',
        zoom: {
          enabled: false,
        },
      },
      colors: ['#4A00E5'],
      dataLabels: {
        enabled: false,
      },
      title: {
        text: '',
        align: 'left',
      },
      xaxis: {
        categories: Object.keys(this.courbeVente24hList).map((key: any) => `${key}H`),
        // categories: [
        //   'Jan',
        //   'Feb',
        //   'Mar',
        //   'Apr',
        //   'May',
        //   'Jun',
        //   'Jul',
        //   'Aug',
        //   'Sep',
        //   'Oct',
        //   'Nov',
        //   'Dec',
        // ],
      },
      yaxis: {
        min: 10,
        max: 60,
        tickAmount: 5,
        labels: {
          formatter: (val: number) => {
            return val / 1 + 'K';
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },
    };
  }

}
