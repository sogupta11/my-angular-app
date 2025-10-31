import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="layout-container">
      <header class="header">
        <div class="header-content">
          <h1 class="logo">User Management Portal</h1>
          <nav class="nav">
            <a routerLink="/users" routerLinkActive="active" class="nav-link">Users</a>
            <a routerLink="/add" routerLinkActive="active" class="nav-link">Add User</a>
          </nav>
        </div>
      </header>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="footer">
        <p>&copy; 2025 User Management Portal - Angular 20 Demo</p>
      </footer>
    </div>
  `,
  styleUrl: './layout.component.css'
})
export class LayoutComponent {}