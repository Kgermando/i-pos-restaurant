import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { IUser } from '../../../auth/models/user';
import { IProduct } from '../../../models/product.model';
import { routes } from '../../../shared/routes/routes';
import { IdDataService } from '../../commandes-lines/id-data.service';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-liv-product-line',
  templateUrl: './liv-product-line.component.html',
  styleUrl: './liv-product-line.component.scss'
})
export class LivProductLineComponent implements OnInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes; 

  currentUser!: IUser;

  public search = '';
  dataList: IProduct[] = [];

  livraisonId!: number; 


  constructor(
    private router: Router,
    private authService: AuthService,
    private idDataService: IdDataService, 
    private productService: ProductService,  
  ) { }

  ngOnInit() {
    this.loadUserData = true;
    this.isLoadingData = true;
    this.idDataService.currentId.subscribe(id => {
      this.livraisonId = id;
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadUserData = false;
        this.productService.refreshDataList$.subscribe(() => {
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
    this.productService.getAllByEntrepriseByPosSearch(this.currentUser.entreprise?.code!, 
      this.currentUser.pos?.ID!, this.search).subscribe((res) => {
      this.dataList = res.data;
      this.idDataService.changeProd(this.dataList.length); // Pour transferer La taille des donnees de products a commandeline
      this.isLoadingData = false;
    });
  }

  onSearchChange(search: string) {
    this.search = search;
    this.fetchProducts();
  }

 

}


