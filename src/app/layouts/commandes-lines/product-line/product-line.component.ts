import { Component, OnInit } from '@angular/core'; 
import { IUser } from '../../../auth/models/user';
import { routes } from '../../../shared/routes/routes';
import { IProduct } from '../../../models/product.model';  
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';  
import { ProductService } from '../../products/product.service'; 
import { IdDataService } from '../id-data.service';


@Component({
  selector: 'app-product-line',
  templateUrl: './product-line.component.html',
  styleUrl: './product-line.component.scss'
})
export class ProductLineComponent implements OnInit {
  loadUserData = false;
  isLoadingData = false;
  public routes = routes; 

  currentUser!: IUser;

  public search = '';
  dataList: IProduct[] = [];

  commandeId!: number; 


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
      this.commandeId = id;
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

      console.log("dataList", this.dataList);
    });
  }

  onSearchChange(search: string) {
    this.search = search;
    this.fetchProducts();
  }

 

}

