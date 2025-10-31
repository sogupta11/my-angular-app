import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/users', pathMatch: 'full' },
      { 
        path: 'users', 
        loadComponent: () => import('./components/user-list/user-list.component').then(c => c.UserListComponent)
      },
      { 
        path: 'add', 
        loadComponent: () => import('./components/add-user/add-user.component').then(c => c.AddUserComponent)
      },
      { 
        path: 'edit/:id', 
        loadComponent: () => import('./components/edit-user/edit-user.component').then(c => c.EditUserComponent)
      },
      { 
        path: 'details/:id', 
        loadComponent: () => import('./components/user-details/user-details.component').then(c => c.UserDetailsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/users' }
];
