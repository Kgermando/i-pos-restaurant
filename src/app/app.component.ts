import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import {
  NavigationEnd,
  NavigationStart,

  Event as RouterEvent,
} from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { ProductDbService } from './layouts/products/product-db.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'pos-stock';

  public page = '';
  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private zone: NgZone,
    private router: Router,
    private productDbService: ProductDbService,
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        const URL = event.url.split('/');
        this.page = URL[1];
      }
      if (event instanceof NavigationEnd) { }
    });
  }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd),
          first(),
        ).subscribe(() => {
          const preloader = document.querySelector('.site-preloader');

          if (!preloader) {
            return;
          }

          preloader.addEventListener('transitionend', (event: Event) => {
            if (event instanceof TransitionEvent && event.propertyName === 'opacity') {
              preloader.remove();
              document.querySelector('.site-preloader-style')?.remove();
            }
          });
          preloader.classList.add('site-preloader__fade');

          // Sometimes, due to unexpected behavior, the browser (in particular Safari) may not play the transition, which leads
          // to blocking interaction with page elements due to the fact that the preloader is not deleted.
          // The following block covers this case.
          if (getComputedStyle(preloader).opacity === '0' && preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          }
        });
      });
    }

    // this.syncData();
  }

  syncData() {
    if (navigator.onLine) {
      this.productDbService.syncWithBackend().then(() => {
        console.log('Données synchronisées avec succès');
      }).catch((error) => {
        console.error('Erreur de synchronisation', error);
      });
    } else {
      console.log('Vous êtes hors ligne, synchronisation différée.');
    }
  }
}
