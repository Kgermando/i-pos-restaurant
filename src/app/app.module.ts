import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr, ToastrModule } from 'ngx-toastr'; 

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { CurrencyPipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; 
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';  
import { CredentialInterceptor } from './auth/interceptors/credential.interceptor'; 
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { NgChartsModule } from 'ng2-charts';
import { DatabaseService } from './services/database.service';
import { UserLocalService } from './services/user.local.service';
import { AuthLocalService } from './services/auth.local.service';
import { EntrepriseLocalService } from './services/entreprise.local.service';
import { PosLocalService } from './services/pos.local.service';

registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [
    AppComponent, 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot(), 

    SharedModule, NgChartsModule,

    
  ],
  providers: [
    DatabaseService,
    // UserLocalService,
    // AuthLocalService,
    // EntrepriseLocalService,
    // PosLocalService,
    

    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialInterceptor,
      multi: true
    },
    // { 
    //   provide: HTTP_INTERCEPTORS, 
    //   useClass: CacheInterceptor, 
    //   multi: true 
    // },
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
    CurrencyPipe, { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
