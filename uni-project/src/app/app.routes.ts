import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthPageComponent } from './pages/authentication/auth-page/auth-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { DepositComponent } from './pages/deposit/deposit.component';
import { FoodReserveComponent } from './pages/food-reserve/food-reserve.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CoursesComponent } from './pages/courses/courses.component';


export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthPageComponent,
    children: [
      { path: 'login', component: AuthPageComponent, data: { mode: 'login' } },
      { path: 'register', component: AuthPageComponent, data: { mode: 'register' } },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [

      { path: 'dashboard', component: DashboardComponent },
      { path: 'deposit', component: DepositComponent },
      { path: 'food-reserve', component: FoodReserveComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'courses', component: CoursesComponent },
      {
        path: 'settings',
        children: [
          // { path: 'general', component: GeneralSettingsComponent },
          // { path: 'security', component: SecuritySettingsComponent },
          { path: '', redirectTo: 'general', pathMatch: 'full' }
        ]
      }
    ]
  },
  { path: '**', component: NotFoundComponent }
];