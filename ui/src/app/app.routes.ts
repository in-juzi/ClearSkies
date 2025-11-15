import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'manual',
    loadComponent: () => import('./components/manual/manual.component').then(m => m.ManualComponent)
  },
  {
    path: 'game/loading',
    canActivate: [authGuard],
    loadComponent: () => import('./components/game-loading/game-loading.component').then(m => m.GameLoadingComponent)
  },
  {
    path: 'game',
    canActivate: [authGuard],
    loadComponent: () => import('./components/game/game.component').then(m => m.GameComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
