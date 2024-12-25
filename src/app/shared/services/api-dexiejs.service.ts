import Dexie from 'dexie';
import { environment } from '../../../environments/environment';

export abstract class AbstractDatabase {
  db: Dexie;

  products: Dexie.Table<any, number> | undefined;
  stocks: Dexie.Table<any, number> | undefined;
  commandes: Dexie.Table<any, number> | undefined;
  commandelines: Dexie.Table<any, number> | undefined;
  clients: Dexie.Table<any, number> | undefined;
  fournisseurs: Dexie.Table<any, number> | undefined;
  stocks_dispo: Dexie.Table<any, number> | undefined;

  constructor() {
    this.db = new Dexie('iPosStock');
    this.initializeDatabase();
  }

  private initializeDatabase() {
    this.db.version(1).stores({
      // setting: '++id, delai_sync, ',
      products: '++id, reference, name, description, unite_vente, prix_vente, tva, signature, pos_id, code_entreprise, created_at, updated_at',
      stocks: '++id, product_id, description, fournisseur_id, quantity, prix_achat, date_expiration, signature, pos_id, code_entreprise, created_at, updated_at',
      commandes: '++id, ncommande, status, client_id, signature, pos_id, code_entreprise, created_at, updated_at',
      commandelines: '++id, commande_id, product_id, quantity, signature, code_entreprise, created_at, updated_at',
      clients: '++id, fullname, telephone, email, signature, code_entreprise, created_at, updated_at',
      fournisseurs: '++id, name, telephone, email, adresse, type_fourniture, signature, code_entreprise, created_at, updated_at',
      stocks_dispo: '++id, product_id, qty_stock, qty_cmdline, price_stock, pos_id, code_entreprise',
    });

    this.products = this.db.table('products');
    this.stocks = this.db.table('stocks');
    this.commandes = this.db.table('commandes');
    this.commandelines = this.db.table('commandelines');
    this.clients = this.db.table('clients');
    this.fournisseurs = this.db.table('fournisseurs');
    this.stocks_dispo = this.db.table('stocks_dispo');
  }

  // Méthode pour synchroniser les données avec le backend
  async syncWithBackend() {
    if (navigator.onLine) {
      try {
        const syncTasks = [
          this.syncTable(this.products!, `${environment.apiUrl}/products`),
          this.syncTable(this.stocks!, `${environment.apiUrl}/stocks`),
          this.syncTable(this.commandes!, `${environment.apiUrl}/commandes`),
          this.syncTable(this.commandelines!, `${environment.apiUrl}/commandes-lines`),
          this.syncTable(this.clients!, `${environment.apiUrl}/clients`),
          this.syncTable(this.fournisseurs!, `${environment.apiUrl}/fournisseurs`),
          this.syncTable(this.stocks_dispo!, `${environment.apiUrl}/stocks-dispos`),
        ];
        await Promise.all(syncTasks);
        console.log('Synchronization completed successfully.', syncTasks);
      } catch (error) {
        console.error('Synchronization error:', error);
      }
    } else {
      console.log('Offline: Synchronization deferred.');
    }
  }

  // Méthode générique pour synchroniser une table avec un endpoint API
  private async syncTable(table: Dexie.Table<any, number>, apiEndpoint: string) {

    // Récupérer les données locales
    const localData = await table.toArray();

    console.log("localData", localData)

    // Envoyer les données locales au backend (POST pour créer, PUT pour mettre à jour, DELETE pour supprimer)
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(localData),
      credentials: 'include'  // Ajouter les credentials dans les en-têtes
    });

    if (response.ok) {
      // Récupérer les données mises à jour du backend
      const remoteData = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'  // Ajouter les credentials dans les en-têtes
      }).then(res => res.json());
      // Utiliser bulkPut pour insérer ou mettre à jour les enregistrements locaux
      await table.bulkPut(remoteData);
    } else {
      console.error('Failed to sync table:', apiEndpoint);
    }
  }
}
