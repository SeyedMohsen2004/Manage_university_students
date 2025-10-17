import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { ThemeService } from '../../services/theme/theme.service';
import { SidebarService } from '../../services/sidebar.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { AuthService } from '../../services/authentication/auth.service';
import { FoodReserveService } from '../../services/food-reserve.service';
import { ProfileService } from '../../services/profile.service';


@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzDrawerModule,
    ThemeToggleComponent,
    NzAvatarModule,
    NzDropDownModule,
    NzBadgeModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'

})
export class MainLayoutComponent implements OnInit, OnDestroy {
  amount: string | null = null;
  isCollapsed = false;
  isMobile = false;
  isDrawerOpen = false;
  private breakpointSubscription!: Subscription;
  userProfileImage: string = '/assets/avatars/default-profile.png';
  userName: string = '';
  private profileSub: Subscription | null = null;

  constructor(private breakpointObserver: BreakpointObserver, public themeService: ThemeService, private sidebarService: SidebarService, private router: Router,
    private authService: AuthService,private profileService: ProfileService) {
    this.checkScreenSize();
    this.sidebarService.isMobile$.subscribe(
      (isMobile) => (this.isMobile = isMobile)
    );
  }



  onResize(event: Event): void {
    this.checkScreenSize();
  }
  showMobileSidebar = false;
  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.isCollapsed = false;
      this.showMobileSidebar = false;
      document.body.style.overflow = '';
    }
  }

  toggleCollapsed(): void {
    if (this.isMobile) {
      this.showMobileSidebar = !this.showMobileSidebar;
      document.body.style.overflow = this.showMobileSidebar ? 'hidden' : '';
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  closeMobileSidebar(): void {
    this.showMobileSidebar = false;
    document.body.style.overflow = '';
  }
  loadProfile(): void {
    this.authService.getProfile().subscribe(
      (response) => {
        console.log('Profile data:', response);
        this.userProfileImage = response.profile_image || this.userProfileImage;
        this.userName = response.username || response.full_name || '';
      },
      (error) => {
        console.error('Error loading profile:', error);
      }
    );
  }
 loadUserProfile(): void {
    this.profileSub = this.profileService.profileImage$.subscribe((imageUrl) => {
      if (imageUrl) {
        this.userProfileImage = imageUrl;
      }
    });

    this.profileSub.add(
      this.profileService.userInfo$.subscribe((profile) => {
        if (profile) {
          this.userName = profile.username || '';
        }
      })
    );
  }
  ngOnInit(): void {
    this.breakpointSubscription = this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
      .subscribe(result => {
        this.isMobile = result.matches;
        this.isCollapsed = this.isMobile;
        if (!this.isMobile) {
          this.isDrawerOpen = false;
        }
      });
    this.loadProfile();
    this.loadUserProfile();

     this.profileService.amount$.subscribe((val) => {
      this.amount = val;
    });
  }
  ngOnDestroy(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }
  goToProfile() {
    this.router.navigate(['profile']);
  }
  goToSettings() {
    this.router.navigate(['settings/general']);
  }

  logout(): void {
    this.authService.logOut();
    this.router.navigate(['/']);
    if (this.isMobile) {
      this.closeMobileSidebar();
    }
  }
}
