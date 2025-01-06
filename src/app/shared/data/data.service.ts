import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { routes } from '../routes/routes';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private collapseSubject = new BehaviorSubject<boolean>(false);
  collapse$ = this.collapseSubject.asObservable();

  toggleCollapse() {
    this.collapseSubject.next(!this.collapseSubject.value);
  }

  public sidebarDataGestion = [
    {
      tittle: 'Gestion de commandes',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Tables',
          icon: 'list-check',
          base: 'table-box',
          route: routes.tableBoxList,
          hasSubRoute: false,
          showSubRoute: false, 
        },
        {
          menuValue: 'Livraisons',
          icon: 'truck',
          base: 'livraisons',
          route: routes.livraisonList, 
          hasSubRoute: false,
          showSubRoute: false,
        },
      ],
    }, 
    {
      tittle: 'Gestion de stocks',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Plats',
          icon: 'brand-airtable',
          base: 'plats',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.platList,
        },
        {
          menuValue: 'Produits',
          icon: 'brand-airtable',
          base: 'products',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.productList,
        },
        {
          menuValue: 'Ingredients',
          icon: 'brand-airtable',
          base: 'ingredients',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.ingredientList,
        },  
      ],
    },
    {
      tittle: 'TRESORERIE',
      showAsTab: true,
      separateRoute: false,
      menu: [ 
        {
          menuValue: 'Caisse',
          icon: 'receipt',
          base: 'finances',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.caisseList,
        },
      ],
    },
    {
      tittle: 'Partenaires',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Clients',
          icon: 'user-up',
          base: 'clients',
          route: routes.clientList,
          hasSubRoute: false,
          showSubRoute: false,
        },
        {
          menuValue: 'Livreurs',
          icon: 'user-up',
          base: 'livreurs',
          route: routes.livreurList, 
          hasSubRoute: false,
          showSubRoute: false,
        }, 
        {
          menuValue: 'Fournisseurs',
          icon: 'user-down',
          base: 'fournisseurs',
          route: routes.fournisseurList, 
          hasSubRoute: false,
          showSubRoute: false,
        },
        {
          menuValue: 'Zones',
          icon: 'map',
          base: 'zones',
          route: routes.areaList, 
          hasSubRoute: false,
          showSubRoute: false,
        },
      ],
    },
  ];

  public sidebarData = [
    // {
    //   tittle: 'Reporting',
    //   showAsTab: true,
    //   separateRoute: false,
    //   menu: [ 
    //     {
    //       menuValue: 'Tableau de board',
    //       icon: 'layout-2',
    //       base: 'dashboard',
    //       route: routes.dashboard,
    //       hasSubRoute: false,
    //       showSubRoute: false, 
    //     }, 
    //   ],
    // },
    {
      tittle: 'Main MENU',
      showAsTab: false,
      separateRoute: false,
      hasSubRoute: false,
      showSubRoute: true,
      menu: [
        {
          menuValue: 'Dashboard',
          hasSubRoute: true,
          showSubRoute: true,
          icon: 'layout-2',
          base: 'dashboard',
          subMenus: [
            {
              menuValue: 'Caisses',
              route: routes.dashboardCaisse,
            },
            {
              menuValue: 'Plats & Produits',
              route: routes.dashboardPlatProduct,
            },
            {
              menuValue: 'Clients & Fourniseurs',
              route: routes.dashboardClientFournisseur,
            },
          ]
        },
      ],
    },
    {
      tittle: 'Gestion de commandes',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Tables',
          icon: 'list-check',
          base: 'table-box',
          route: routes.tableBoxList,
          hasSubRoute: false,
          showSubRoute: false, 
        },
        {
          menuValue: 'Livraisons',
          icon: 'truck',
          base: 'livraisons',
          route: routes.livraisonList,
          hasSubRoute: false,
          showSubRoute: false,
        }, 
      ],
    }, 
    { 
      tittle: 'Gestion de stocks',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Plats',
          icon: 'brand-airtable',
          base: 'plats',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.platList,
        },
        {
          menuValue: 'Produits',
          icon: 'brand-airtable',
          base: 'products',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.productList,
        },
        {
          menuValue: 'Ingredients',
          icon: 'brand-airtable',
          base: 'ingredients',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.ingredientList,
        }, 
      ],
    },
    {
      tittle: 'Partenaires',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Clients',
          icon: 'user-up',
          base: 'clients',
          route: routes.clientList,
          hasSubRoute: false,
          showSubRoute: false,
        },
        {
          menuValue: 'Livreurs',
          icon: 'user-up',
          base: 'livreurs',
          route: routes.livreurList, 
          hasSubRoute: false,
          showSubRoute: false,
        }, 
        {
          menuValue: 'Fournisseurs',
          icon: 'user-down',
          base: 'fournisseurs',
          route: routes.fournisseurList, 
          hasSubRoute: false,
          showSubRoute: false,
        },
        {
          menuValue: 'Zones',
          icon: 'map',
          base: 'zones',
          route: routes.areaList, 
          hasSubRoute: false,
          showSubRoute: false,
        },
      ],
    },
    {
      tittle: 'TRESORERIE',
      showAsTab: true,
      separateRoute: false,
      menu: [ 
        {
          menuValue: 'Caisse',
          icon: 'receipt',
          base: 'finances',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.caisseList,
        },
      ],
    },
    {
      tittle: 'MANAGEMENT',
      showAsTab: true,
      separateRoute: false,
      menu: [ 
        {
          menuValue: 'POS',
          icon: 'home',
          base: 'pos',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.posList,
        },
        {
          menuValue: 'Personnels',
          icon: 'users',
          base: 'users', 
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.userList,
        },
      ],
    },
  ];


  public sidebarDataSupport = [
    {
      tittle: 'Main MENU',
      showAsTab: false,
      separateRoute: false,
      hasSubRoute: false,
      showSubRoute: true,
      menu: [
        {
          menuValue: 'Dashboard',
          hasSubRoute: true,
          showSubRoute: true,
          icon: 'layout-2',
          base: 'dashboard',
          subMenus: [
            {
              menuValue: 'Caisses',
              route: routes.dashboardCaisse,
            },
            {
              menuValue: 'Plats & Produits',
              route: routes.dashboardPlatProduct,
            },
            {
              menuValue: 'Clients & Fourniseurs',
              route: routes.dashboardClientFournisseur,
            },
          ]
        },
      ],
    },
    {
      tittle: 'Gestion de commandes',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Tables',
          icon: 'list-check',
          base: 'table-box',
          route: routes.tableBoxList,
          hasSubRoute: false,
          showSubRoute: false, 
        },
        {
          menuValue: 'Livraisons',
          icon: 'truck',
          base: 'livraisons',
          route: routes.livraisonList,
          hasSubRoute: false,
          showSubRoute: false,
        },
      ],
    }, 
    {
      tittle: 'Gestion de stocks',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Plats',
          icon: 'brand-airtable',
          base: 'plats',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.platList,
        },
        {
          menuValue: 'Produits',
          icon: 'brand-airtable',
          base: 'products',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.productList,
        },
        {
          menuValue: 'Ingredients',
          icon: 'brand-airtable',
          base: 'ingredients',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.ingredientList,
        }, 
       
        // {
        //   menuValue: 'Categories',
        //   icon: 'home',
        //   base: 'categories',
        //   hasSubRoute: false,
        //   showSubRoute: false,
        //   route: routes.categorieList,
        // },
      ],
    },
    {
      tittle: 'Partenaires',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Clients',
          icon: 'user-up',
          base: 'clients',
          route: routes.clientList,
          hasSubRoute: false,
          showSubRoute: false,
        },
        {
          menuValue: 'Livreurs',
          icon: 'user-up',
          base: 'livreurs',
          route: routes.livreurList, 
          hasSubRoute: false,
          showSubRoute: false,
        }, 
        {
          menuValue: 'Fournisseurs',
          icon: 'user-down',
          base: 'fournisseurs',
          route: routes.fournisseurList, 
          hasSubRoute: false,
          showSubRoute: false,
        },
        {
          menuValue: 'Zones',
          icon: 'map',
          base: 'zones',
          route: routes.areaList, 
          hasSubRoute: false,
          showSubRoute: false,
        },
      ],
    },
    {
      tittle: 'TRESORERIE',
      showAsTab: true,
      separateRoute: false,
      menu: [ 
        {
          menuValue: 'Caisse',
          icon: 'receipt',
          base: 'finances',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.caisseList,
        },
      ],
    },
    {
      tittle: 'MANAGEMENT',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'POS',
          icon: 'home',
          base: 'pos',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.posList,
        },
        {
          menuValue: 'Personnels',
          icon: 'users',
          base: 'users', 
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.userList,
        },
        {
          menuValue: 'Entreprises',
          icon: 'building-factory',
          base: 'entreprises',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.entrepriseList,
        },
      ],
    },
  ];


}
