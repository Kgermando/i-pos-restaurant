import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarcodeGeneratorAllModule, QRCodeGeneratorAllModule, DataMatrixGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator'


import { LayoutsRoutingModule } from './layouts-routing.module';
import { LayoutsComponent } from './layouts.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { LayoutCommonComponent } from './common/layout-common/layout-common.component';
import { HeaderComponent } from './common/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { PosComponent } from './pos/pos.component';
import { PosViewComponent } from './pos/pos-view/pos-view.component';
import { ProductComponent } from './products/product/product.component';
import { ProductTableComponent } from './products/product-table/product-table.component';
import { ProductCardComponent } from './products/product-card/product-card.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { StocksComponent } from './stocks/stocks.component';
import { StockCardComponent } from './stocks/stock-card/stock-card.component';
import { StockTableComponent } from './stocks/stock-table/stock-table.component';
import { StockViewComponent } from './stocks/stock-view/stock-view.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { CommandesComponent } from './commandes/commandes.component';
import { CommandeTableComponent } from './commandes/commande-table/commande-table.component';
import { CommandeCardComponent } from './commandes/commande-card/commande-card.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientViewComponent } from './clients/client-view/client-view.component';
import { ClientTableComponent } from './clients/client-table/client-table.component';
import { ClientCardComponent } from './clients/client-card/client-card.component';
import { FournisseurCardComponent } from './fournisseurs/fournisseur-card/fournisseur-card.component';
import { FournisseurTableComponent } from './fournisseurs/fournisseur-table/fournisseur-table.component';
import { FournisseursComponent } from './fournisseurs/fournisseurs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommandesLinesComponent } from './commandes-lines/commandes-lines.component';
import { CmdQtyInputComponent } from './commandes-lines/cmd-qty-input/cmd-qty-input.component';
import { CmdFactureComponent } from './commandes-lines/cmd-facture/cmd-facture.component';
import { FatureComponent } from './commandes/fature/fature.component';
import { FactureViewComponent } from './commandes/facture-view/facture-view.component';
import { ProdStyleComponent } from './products/prod-style/prod-style.component';
import { SummaryComponent } from './dashboard/summary/summary.component';
import { PlatComponent } from './plat/plat.component';
import { TableBoxComponent } from './table-box/table-box.component';
import { ProductLineComponent } from './commandes-lines/product-line/product-line.component';
import { PlatLineComponent } from './commandes-lines/plat-line/plat-line.component';
import { PlatCardComponent } from './plat/plat-card/plat-card.component';
import { PlatTableComponent } from './plat/plat-table/plat-table.component';
import { ProdQtyDispoComponent } from './products/prod-qty-dispo/prod-qty-dispo.component';
import { ProdItemComponent } from './commandes-lines/product-line/prod-item/prod-item.component';
import { TableTotalCmdComponent } from './table-box/table-total-cmd/table-total-cmd.component';
import { PlatItemComponent } from './commandes-lines/plat-line/plat-item/plat-item.component';
import { IngredientCardComponent } from './ingredients/ingredient-card/ingredient-card.component';
import { IngredientTableComponent } from './ingredients/ingredient-table/ingredient-table.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { IngredientStocksComponent } from './ingredient-stocks/ingredient-stocks.component';
import { IngStockCardComponent } from './ingredient-stocks/ing-stock-card/ing-stock-card.component';
import { IngStockTableComponent } from './ingredient-stocks/ing-stock-table/ing-stock-table.component';
import { IngredientItemComponent } from './ingredients/ingredient-item/ingredient-item.component';
import { LivraisonsComponent } from './livraisons/livraisons.component';
import { LivreursComponent } from './livreurs/livreurs.component';
import { LivreurCardComponent } from './livreurs/livreur-card/livreur-card.component';
import { LivreurTableComponent } from './livreurs/livreur-table/livreur-table.component';
import { AreaComponent } from './area/area.component';
import { LivraisonLineComponent } from './livraisons/livraison-line/livraison-line.component';
import { LivFactureComponent } from './livraisons/livraison-line/liv-facture/liv-facture.component';
import { LivPlatLineComponent } from './livraisons/liv-plat-line/liv-plat-line.component';
import { LivProductLineComponent } from './livraisons/liv-product-line/liv-product-line.component';
import { LivPlatItemComponent } from './livraisons/liv-plat-line/liv-plat-item/liv-plat-item.component';
import { LivProdItemComponent } from './livraisons/liv-product-line/liv-prod-item/liv-prod-item.component';
import { LivraisonFactureComponent } from './livraisons/livraison-facture/livraison-facture.component';


@NgModule({
  declarations: [
    LayoutsComponent,
    SidebarComponent,
    LayoutCommonComponent,
    HeaderComponent,
    ProfileComponent,
    EntrepriseComponent,
    PosComponent,
    PosViewComponent,
    ProductComponent,
    ProductTableComponent,
    ProductCardComponent,
    StocksComponent,
    StockCardComponent,
    StockTableComponent,
    StockViewComponent,
    ProgressBarComponent,
    CommandesComponent,
    CommandeTableComponent,
    CommandeCardComponent,
    ClientsComponent,
    ClientViewComponent,
    ClientTableComponent,
    ClientCardComponent,
    FournisseurCardComponent,
    FournisseurTableComponent,
    FournisseursComponent,
    DashboardComponent,
    CommandesLinesComponent,
    CmdQtyInputComponent,
    CmdFactureComponent,
    FatureComponent,
    FactureViewComponent,
    ProdStyleComponent,
    SummaryComponent,
    PlatComponent,
    TableBoxComponent,
    ProductLineComponent,
    PlatLineComponent,
    PlatCardComponent,
    PlatTableComponent,
    ProdQtyDispoComponent,
    ProdItemComponent,
    TableTotalCmdComponent,
    PlatItemComponent,
    IngredientCardComponent,
    IngredientTableComponent,
    IngredientsComponent,
    IngredientStocksComponent,
    IngStockCardComponent,
    IngStockTableComponent,
    IngredientItemComponent,
    LivraisonsComponent,
    LivreursComponent,
    LivreurCardComponent,
    LivreurTableComponent,
    AreaComponent,
    LivraisonLineComponent,
    LivFactureComponent,
    LivPlatLineComponent,
    LivProductLineComponent,
    LivPlatItemComponent,
    LivProdItemComponent,
    LivraisonFactureComponent,
  ],
  imports: [
    CommonModule,
    LayoutsRoutingModule,
    SharedModule,
    BarcodeGeneratorAllModule,
    QRCodeGeneratorAllModule,
    DataMatrixGeneratorAllModule,
    ZXingScannerModule,
  ]
})
export class LayoutsModule { }
