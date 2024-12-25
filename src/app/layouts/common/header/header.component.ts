import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SidebarService } from '../../../shared/sidebar/sidebar.service';
import { CommonService } from '../../../shared/common/common.service';
import { routes } from '../../../shared/routes/routes';
import { SettingsService } from '../../../shared/settings/settings.service';
import { Auth } from '../../../auth/classes/auth';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { IUser } from '../../../auth/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  base = '';
  page = '';
  last = '';
  themeMode = 'light_mode';
  public miniSidebar = false;
  public routes = routes;

  currentUser!: IUser;
  isLoading = false;


  constructor(
    private common: CommonService,
    private router: Router,
    private sidebar: SidebarService,
    private settings: SettingsService,
    private authService: AuthService,
    private location: Location
  ) {
    this.common.base.subscribe((base: string) => {
      this.base = base;
    });
    this.common.page.subscribe((page: string) => {
      this.page = page;
    });
    this.common.last.subscribe((last: string) => {
      this.last = last;
    });
    this.sidebar.sideBarPosition.subscribe((res: string) => {
      if (res == 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });
    this.settings.themeMode.subscribe((res: string) => {
      this.themeMode = res;
    });
  }

  ngOnInit(): void {
    Auth.userEmitter.subscribe(
      user => {
        this.currentUser = user;
      }
    );
  }


  logout() {
    this.isLoading = true;
    this.authService.logout()
    this.router.navigate(['/auth/login']);
  }


  public toggleSidebar(): void {
    this.sidebar.switchSideMenuPosition();
  }

  public togglesMobileSideBar(): void {
    this.sidebar.switchMobileSideBarPosition();
  }

  public miniSideBarMouseHover(position: string): void {
    if (position == 'over') {
      this.sidebar.expandSideBar.next(true);
    } else {
      this.sidebar.expandSideBar.next(false);
    }
  }
  public changeThemeMode(theme: string): void {
    this.settings.themeMode.next(theme);
    localStorage.setItem('themeMode', theme);
  }

  goBack() {
    this.location.back();
  }

}
