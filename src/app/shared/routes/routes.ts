export class routes {
  private static Url = '';

  public static get baseUrl(): string {
    return this.Url;
  }
  public static get core(): string {
    return this.baseUrl;
  }


  // Auth
  public static get auth(): string {
    return this.core + '/auth';
  }
  public static get login(): string {
    return this.auth + '/login';
  }

  public static get forgotPassword(): string {
    return this.auth + '/forgot-password';
  }

  public static get register(): string {
    return this.auth + '/register';
  }
  public static get emailVerification(): string {
    return this.auth + '/email-verification';
  }

  public static get lockScreen(): string {
    return this.auth + '/lock-screen';
  }


  // Layouts

  // Dashboard
  public static get dashboard(): string {
    return this.core + '/web/dashboard';
  }



  // Users
  public static get user(): string {
    return this.core + '/web/users';
  }
  public static get userList(): string {
    return this.user + '/user-list';
  }

  // Entreprises
  public static get entreprise(): string {
    return this.core + '/web/entreprises';
  }
  public static get entrepriseList(): string {
    return this.entreprise + '/entreprise-list';
  }

  // POS
  public static get pos(): string {
    return this.core + '/web/pos';
  }
  public static get posList(): string {
    return this.pos + '/pos-list';
  }

  // Categories
  public static get category(): string {
    return this.core + '/web/categories';
  }
  public static get categorieList(): string {
    return this.category + '/categorie-list';
  }

  // products
  public static get product(): string {
    return this.core + '/web/products';
  }
  public static get productList(): string {
    return this.product + '/product-list';
  }

  // plats
  public static get plat(): string {
    return this.core + '/web/plats';
  }
  public static get platList(): string {
    return this.plat + '/plat-list';
  }

  // table-box
  public static get tableBox(): string {
    return this.core + '/web/table-box';
  }
  public static get tableBoxList(): string {
    return this.tableBox + '/table-box-list';
  }

  // commandes
  public static get commande(): string {
    return this.core + '/web/commandes';
  }
  public static get commandeList(): string {
    return this.commande + '/commande-list';
  }

  // clients
  public static get client(): string {
    return this.core + '/web/clients';
  }
  public static get clientList(): string {
    return this.client + '/client-list';
  }

  // fournisseurs
  public static get fournisseur(): string {
    return this.core + '/web/fournisseurs';
  }
  public static get fournisseurList(): string {
    return this.fournisseur + '/fournisseur-list';
  }

  // livraisons
  public static get livraison(): string {
    return this.core + '/web/livraisons';
  }
  public static get livraisonList(): string {
    return this.livraison + '/livraison-list';
  }

  // livreurs
  public static get livreur(): string {
    return this.core + '/web/livreurs';
  }
  public static get livreurList(): string {
    return this.livreur + '/livreur-list';
  }

  // ingredients
  public static get ingredient(): string {
    return this.core + '/web/ingredients';
  }
  public static get ingredientList(): string {
    return this.ingredient + '/ingredient-list';
  }

  // Table
  public static get table(): string {
    return this.core + '/web/tables';
  }
  public static get tableList(): string {
    return this.table + '/table-list';
  }

  // Area
  public static get area(): string {
    return this.core + '/web/areas';
  }
  public static get areaList(): string {
    return this.area + '/area-list';
  }

  // Finances
  public static get finance(): string {
    return this.core + '/web/finances';
  }
  public static get caisseList(): string {
    return this.finance + '/caisse-list';
  }


}
