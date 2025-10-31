import { Component, OnInit, OnDestroy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { TitleCasePipe } from '../../pipes/title-case.pipe';
import { EmailDomainPipe } from '../../pipes/email-domain.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule, 
    TitleCasePipe, 
    EmailDomainPipe, 
    HighlightDirective
  ],
  template: `
    <div class="user-list-container">
      <div class="header-section">
        <h2>User Management</h2>
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-number">{{ userService.totalUsers() }}</div>
            <div class="stat-label">Total Users</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ userService.activeUsers() }}</div>
            <div class="stat-label">Active Users</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ userService.filteredUsers().length }}</div>
            <div class="stat-label">Filtered Results</div>
          </div>
        </div>
      </div>

      <div class="controls-section">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Search users by name, email, or department..."
            class="search-input"
            [value]="searchTerm()"
            (input)="onSearchChange($event)"
          >
          @if (searchTerm()) {
            <button class="clear-search-btn" (click)="clearSearch()">×</button>
          }
        </div>
        <a routerLink="/add" class="add-user-btn">
          <span class="btn-icon">+</span>
          Add New User
        </a>
      </div>

      @if (userService.loading()) {
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      }

      @if (userService.error()) {
        <div class="error-container">
          <div class="error-message">
            <strong>Error:</strong> {{ userService.error() }}
          </div>
          <button class="retry-btn" (click)="loadUsers()">Retry</button>
        </div>
      }

      @if (!userService.loading() && !userService.error()) {
        <div class="table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of filteredUsers(); track user.id) {
                <tr appHighlight="#f5f5f5" class="user-row">
                  <td class="user-name">
                    <div class="name-container">
                      <strong>{{ user.firstName | titleCase }} {{ user.lastName | titleCase }}</strong>
                      <small>ID: {{ user.id }}</small>
                    </div>
                  </td>
                  <td class="user-email">
                    <div class="email-container">
                      <span>{{ user.email }}</span>
                      <small class="domain">@{{ user.email | emailDomain }}</small>
                    </div>
                  </td>
                  <td>
                    <span class="department-badge" [class]="getDepartmentClass(user.department)">
                      {{ user.department | titleCase }}
                    </span>
                  </td>
                  <td>{{ user.position | titleCase }}</td>
                  <td>
                    <span class="status-badge" [class]="user.isActive ? 'status-active' : 'status-inactive'">
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <a [routerLink]="['/details', user.id]" class="action-btn view-btn" title="View Details">
                        👁️
                      </a>
                      <a [routerLink]="['/edit', user.id]" class="action-btn edit-btn" title="Edit User">
                        ✏️
                      </a>
                      <button 
                        class="action-btn delete-btn" 
                        title="Delete User"
                        (click)="confirmDelete(user)"
                        [disabled]="userService.loading()"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="empty-state">
                    @if (searchTerm()) {
                      <div class="no-results">
                        <h3>No users found</h3>
                        <p>No users match your search criteria "{{ searchTerm() }}"</p>
                        <button class="clear-search-btn-alt" (click)="clearSearch()">Clear Search</button>
                      </div>
                    } @else {
                      <div class="no-data">
                        <h3>No users available</h3>
                        <p>Get started by adding your first user</p>
                        <a routerLink="/add" class="add-first-user-btn">Add First User</a>
                      </div>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Delete Confirmation Modal -->
      @if (showDeleteModal()) {
        <div class="modal-overlay" (click)="cancelDelete()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete 
              <strong>{{ userToDelete()?.firstName }} {{ userToDelete()?.lastName }}</strong>?
            </p>
            <p class="warning-text">This action cannot be undone.</p>
            <div class="modal-actions">
              <button class="cancel-btn" (click)="cancelDelete()">Cancel</button>
              <button class="confirm-delete-btn" (click)="deleteUser()" [disabled]="userService.loading()">
                {{ userService.loading() ? 'Deleting...' : 'Delete User' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, OnDestroy {
  protected userService = inject(UserService);
  
  // Local component signals
  protected showDeleteModal = signal(false);
  protected userToDelete = signal<User | null>(null);
  
  // Computed signals
  protected readonly filteredUsers = computed(() => this.userService.filteredUsers());
  protected readonly searchTerm = computed(() => this.userService.searchTerm());

  // Lifecycle hooks demonstration
  ngOnInit(): void {
    console.log('UserListComponent initialized');
    this.loadUsers();
  }

  ngOnDestroy(): void {
    console.log('UserListComponent destroyed');
    this.userService.clearSearch();
  }

  // Effect to log search changes (lifecycle demonstration)
  searchEffect = effect(() => {
    const term = this.searchTerm();
    if (term) {
      console.log(`Searching for: ${term}, Found: ${this.filteredUsers().length} results`);
    }
  });

  loadUsers(): void {
    this.userService.loadUsers().subscribe({
      next: (users) => {
        console.log('Users loaded successfully:', users.length);
      },
      error: (error) => {
        console.error('Failed to load users:', error);
      }
    });
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.userService.updateSearchTerm(target.value || '');
  }

  clearSearch(): void {
    this.userService.clearSearch();
  }

  confirmDelete(user: User): void {
    this.userToDelete.set(user);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.userToDelete.set(null);
  }

  deleteUser(): void {
    const user = this.userToDelete();
    if (!user) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        console.log('User deleted successfully:', user.id);
        this.showDeleteModal.set(false);
        this.userToDelete.set(null);
      },
      error: (error) => {
        console.error('Failed to delete user:', error);
        // Error is handled by the service and displayed in the UI
      }
    });
  }

  getDepartmentClass(department: string): string {
    const departmentClasses: { [key: string]: string } = {
      'engineering': 'dept-engineering',
      'marketing': 'dept-marketing',
      'sales': 'dept-sales',
      'hr': 'dept-hr',
      'finance': 'dept-finance'
    };
    
    return departmentClasses[department.toLowerCase()] || 'dept-other';
  }
}