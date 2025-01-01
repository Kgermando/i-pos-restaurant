import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../auth/models/user';
import { routes } from '../../../shared/routes/routes';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service'; 
import { IPlat } from '../../../models/plat.model';
import { IdDataService } from '../id-data.service';
import { PlatService } from '../../plat/plat.service';

@Component({
  selector: 'app-plat-line',
  templateUrl: './plat-line.component.html',
  styleUrl: './plat-line.component.scss'
})
export class PlatLineComponent implements OnInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes;

  currentUser!: IUser;
  isLoading = false; 


  public search = '';
  dataList: IPlat[] = [];

  commandeId!: number;

  constructor(
    private router: Router,
    private authService: AuthService,
    private idDataService: IdDataService,
    private platService: PlatService, 
  ) { }

  ngOnInit() {
    this.loadUserData = true;
    this.isLoadingData = true;
    this.idDataService.currentId.subscribe(id => {
      this.commandeId = id;
    });
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.platService.refreshDataList$.subscribe(() => {
          this.fetchProducts();
        });
        this.fetchProducts();
      },
      error: (error) => {
        this.isLoadingData = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });


  }


  // Get all products
  fetchProducts() {
    this.platService.getAllByEntrepriseByPosSearch(this.currentUser.entreprise?.code!, this.currentUser.pos?.ID!, this.search).subscribe((res) => {
      this.dataList = res.data;
      this.idDataService.changePlat(this.dataList.length);
      this.isLoadingData = false;
    });
  }

  onSearchChange(search: string) {
    this.search = search;
    this.fetchProducts();
  }
  
}

