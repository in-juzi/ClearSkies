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
    path: 'admin',
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'items',
        loadComponent: () => import('./components/admin/items/items.component').then(m => m.ItemsComponent)
      },
      {
        path: 'monsters',
        loadComponent: () => import('./components/admin/monsters/monsters.component').then(m => m.MonstersComponent)
      },
      {
        path: 'abilities',
        loadComponent: () => import('./components/admin/abilities/abilities.component').then(m => m.AbilitiesComponent)
      },
      {
        path: 'recipes',
        loadComponent: () => import('./components/admin/recipes/recipes.component').then(m => m.RecipesComponent)
      },
      {
        path: 'locations',
        loadComponent: () => import('./components/admin/locations/locations.component').then(m => m.LocationsComponent)
      },
      {
        path: 'quests',
        loadComponent: () => import('./components/admin/quests/quests.component').then(m => m.QuestsComponent)
      },
      {
        path: 'vendors',
        loadComponent: () => import('./components/admin/vendors/vendors.component').then(m => m.VendorsComponent)
      },
      {
        path: 'activities',
        loadComponent: () => import('./components/admin/activities/activities.component').then(m => m.ActivitiesComponent)
      },
      {
        path: 'drop-tables',
        loadComponent: () => import('./components/admin/drop-tables/drop-tables.component').then(m => m.DropTablesComponent)
      },
      {
        path: 'facilities',
        loadComponent: () => import('./components/admin/facilities/facilities.component').then(m => m.FacilitiesComponent)
      },
      {
        path: 'biomes',
        loadComponent: () => import('./components/admin/biomes/biomes.component').then(m => m.BiomesComponent)
      },
      {
        path: 'qualities',
        loadComponent: () => import('./components/admin/qualities/qualities.component').then(m => m.QualitiesComponent)
      },
      {
        path: 'traits',
        loadComponent: () => import('./components/admin/traits/traits.component').then(m => m.TraitsComponent)
      },
      {
        path: 'design-system',
        loadComponent: () => import('./components/admin/design-system/design-system.component').then(m => m.DesignSystemComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
