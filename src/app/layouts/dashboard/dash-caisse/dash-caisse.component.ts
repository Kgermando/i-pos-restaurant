import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IUser } from '../../../auth/models/user';
import { routes } from '../../../shared/routes/routes';
import { DashCaisseService } from '../services/dash-caisse.service';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { CurrencyPipe, formatDate } from '@angular/common';
import { ChartOptions } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { ICaisse } from '../../../models/caisse.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dash-caisse',
  templateUrl: './dash-caisse.component.html',
  styleUrl: './dash-caisse.component.scss'
})
export class DashCaisseComponent implements OnInit {
  public routes = routes;
  loadUserData = false;

  currentUser!: IUser;
  isLoading = false;

  dateRange!: FormGroup;
  start_date!: string;
  end_date!: string;
  rangeDate: any[] = [];

  totalCaisseEntree: number = 0;
  totalCaisseSorties: number = 0;
  totalCaisseEntreeSorties: number = 0;

  courbeVente24hList: any[] = [];
  courbeProfit24hList: any[] = [];

  totalVente24h: number = 0;
  totalProfit24h: number = 0;
  public chartOptions4: Partial<ChartOptions> | any;


  // Tableaus des entrees et sorties
  dataList: any[] = [];
  displayedColumns: string[] = ['createdat', 'type_transaction', 'montant', 'libelle', 'reference', 'pos', 'signature'];
  dataSource = new MatTableDataSource<ICaisse>(this.dataList);
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;

  constructor(
    private dashCaisseService: DashCaisseService,
    private authService: AuthService,
    private router: Router,
    private currencyPipe: CurrencyPipe,
    private _formBuilder: FormBuilder,
  ) { }

  // Format de devise
  formatCurrency(price: number, currency: string): string {
    return this.currencyPipe.transform(price, currency, 'symbol', '1.2-2', 'fr-FR') || '';
  }

  ngOnInit(): void {
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

        this.GetTotalCaisse(this.currentUser);
        this.GetCourbeVenteProfit24h(this.currentUser);
        this.GetTotalVentesParJour(this.currentUser);
        this.GetTableauEntreeSorties(this.currentUser);

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


  onPageChange(event: PageEvent): void {
    this.isLoading = true;
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.GetTableauEntreeSorties(this.currentUser);
  }


  // Méthode onChanges
  onChanges(): void {   
    this.dateRange.valueChanges.subscribe((val) => {
      this.start_date = formatDate(val.rangeValue[0], 'yyyy-MM-dd', 'en-US');
      this.end_date = formatDate(val.rangeValue[1], 'yyyy-MM-dd', 'en-US');

      this.GetTotalCaisse(this.currentUser);
      this.GetCourbeVenteProfit24h(this.currentUser);
      this.GetTotalVentesParJour(this.currentUser);
      this.GetTableauEntreeSorties(this.currentUser);
    });
  }


  GetTotalCaisse(currentUser: IUser) {
    this.dashCaisseService.GetTotalCaisse(
      currentUser.entreprise!.code!,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.totalCaisseEntree = res.data.total_caisse_entree;
      this.totalCaisseSorties = res.data.total_caisse_sorties;
      this.totalCaisseEntreeSorties = res.data.total_caisse_entree_sorties;
      this.isLoading = false;
    });
  }

  GetCourbeVenteProfit24h(currentUser: IUser) {
    this.dashCaisseService.GetCourbeVenteProfit24h(
      currentUser.entreprise!.code!
    ).subscribe((res) => {
      this.courbeVente24hList = res.data.hourly_sales;
      this.courbeProfit24hList = res.data.hourly_profits;
      this.getCourbeVente24hLineChart(this.courbeVente24hList, this.courbeProfit24hList);
      this.isLoading = false;
    });
  }

  GetTotalVentesParJour(currentUser: IUser) {
    this.dashCaisseService.GetTotalVentesParJour(
      currentUser.entreprise!.code!
    ).subscribe((res) => {
      this.totalVente24h = res.data.total_ventes;
      this.totalProfit24h = res.data.total_profits;
      this.isLoading = false;
    });
  }

  // Tableau des entrees et sorties
  GetTableauEntreeSorties(currentUser: IUser) {
    this.dashCaisseService.GetTableauEntreeSorties(
      currentUser.entreprise!.code!,
      this.pageIndex,
      this.pageSize,
      this.start_date,
      this.end_date
    ).subscribe((res) => {
      this.dataList = res.data;
      this.totalItems = res.pagination.total_pages;
      this.length = res.pagination.length;
      this.dataSource = new MatTableDataSource<any>(this.dataList);
      this.isLoading = false;
    });
  }

  getCourbeVente24hLineChart(courbeVente24hList: any[], courbeProfit24hList: any[]) {
    this.chartOptions4 = {
      series: [
        {
          name: 'Profits journalières',
          data: Object.keys(courbeProfit24hList).map((key: any) => courbeProfit24hList[key]),
        },
        {
          name: 'Ventes journalières',
          data: Object.keys(courbeVente24hList).map((key: any) => courbeVente24hList[key]),
        },
      ],
      chart: {
        height: 273,
        type: 'area',
        zoom: {
          enabled: false,
        },
      },
      colors: ['#00918e', '#4A00E5'],
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
