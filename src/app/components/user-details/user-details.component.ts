import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { TitleCasePipe } from '../../pipes/title-case.pipe';
import { EmailDomainPipe } from '../../pipes/email-domain.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-user-details',
  imports: [
    CommonModule, 
    RouterLink, 
    DatePipe, 
    TitleCasePipe, 
    EmailDomainPipe, 
    HighlightDirective
  ],
  template: `
    <div class="user-details-container">
      <div class="header-section">
        <div class="breadcrumb">
          <a routerLink="/users">Users</a> 
          <span class="separator">></span> 
          @if (currentUser()) {
            <span>{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</span>
          } @else {
            <span>User Details</span>
          }
        </div>
        
        <div class="header-content">
          @if (currentUser()) {
            <div class="user-header">
              <div class="user-avatar">
                <span class="avatar-text">
                  {{ getInitials(currentUser()?.firstName || '', currentUser()?.lastName || '') }}
                </span>
              </div>
              <div class="user-title-section">
                <h1 class="user-name">
                  {{ (currentUser()?.firstName || '') | titleCase }} {{ (currentUser()?.lastName || '') | titleCase }}
                </h1>
                <p class="user-position">{{ (currentUser()?.position || '') | titleCase }}</p>
                <div class="user-meta">
                  <span class="user-id">ID: {{ currentUser()?.id }}</span>
                  <span class="user-status" [class]="currentUser()?.isActive ? 'status-active' : 'status-inactive'">
                    {{ currentUser()?.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
          }
          
          <div class="header-actions">
            <a [routerLink]="['/edit', currentUser()?.id]" class="action-btn edit-btn" [class.disabled]="!currentUser()">
              <span class="btn-icon">✏️</span>
              Edit User
            </a>
            <button 
              class="action-btn delete-btn" 
              (click)="confirmDelete()"
              [disabled]="!currentUser() || userService.loading()"
            >
              <span class="btn-icon">🗑️</span>
              Delete User
            </button>
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading user details...</p>
        </div>
      }

      @if (userService.error() && !loading()) {
        <div class="error-container">
          <div class="error-message">
            <strong>Error:</strong> {{ userService.error() }}
          </div>
          <div class="error-actions">
            <button class="retry-btn" (click)="loadUser()">Retry</button>
            <a routerLink="/users" class="back-btn">Back to Users</a>
          </div>
        </div>
      }

      @if (!loading() && !userService.error() && currentUser()) {
        <div class="details-content">
          
          <!-- Personal Information Card -->
          <div class="info-card" appHighlight="#f8f9fa">
            <div class="card-header">
              <h2 class="card-title">
                <span class="card-icon">👤</span>
                Personal Information
              </h2>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <label class="info-label">Full Name</label>
                  <div class="info-value">
                    {{ (currentUser()?.firstName || '') | titleCase }} {{ (currentUser()?.lastName || '') | titleCase }}
                  </div>
                </div>
                
                <div class="info-item">
                  <label class="info-label">Email Address</label>
                  <div class="info-value email-value">
                    <a [href]="'mailto:' + currentUser()?.email" class="email-link">
                      {{ currentUser()?.email }}
                    </a>
                    <small class="email-domain">{{ (currentUser()?.email || '') | emailDomain }}</small>
                  </div>
                </div>
                
                <div class="info-item">
                  <label class="info-label">Phone Number</label>
                  <div class="info-value">
                    <a [href]="'tel:' + currentUser()?.phone" class="phone-link">
                      {{ currentUser()?.phone }}
                    </a>
                  </div>
                </div>
                
                <div class="info-item">
                  <label class="info-label">Status</label>
                  <div class="info-value">
                    <span class="status-badge" [class]="currentUser()?.isActive ? 'status-active' : 'status-inactive'">
                      {{ currentUser()?.isActive ? 'Active Employee' : 'Inactive Employee' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Information Card -->
          <div class="info-card" appHighlight="#f8f9fa">
            <div class="card-header">
              <h2 class="card-title">
                <span class="card-icon">🏠</span>
                Address Information
              </h2>
            </div>
            <div class="card-body">
              <div class="address-display">
                <div class="address-line">{{ currentUser()?.address?.street }}</div>
                <div class="address-line">
                  {{ currentUser()?.address?.city }}, {{ currentUser()?.address?.state }} {{ currentUser()?.address?.zipCode }}
                </div>
                <div class="address-actions">
                  <a 
                    [href]="getGoogleMapsUrl()" 
                    target="_blank" 
                    class="map-link"
                    rel="noopener noreferrer"
                  >
                    📍 View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Employment Information Card -->
          <div class="info-card" appHighlight="#f8f9fa">
            <div class="card-header">
              <h2 class="card-title">
                <span class="card-icon">💼</span>
                Employment Information
              </h2>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <label class="info-label">Department</label>
                  <div class="info-value">
                    <span class="department-badge" [class]="getDepartmentClass(currentUser()?.department || '')">
                      {{ (currentUser()?.department || '') | titleCase }}
                    </span>
                  </div>
                </div>
                
                <div class="info-item">
                  <label class="info-label">Position</label>
                  <div class="info-value">{{ (currentUser()?.position || '') | titleCase }}</div>
                </div>
                
                <div class="info-item">
                  <label class="info-label">Start Date</label>
                  <div class="info-value">
                    {{ currentUser()?.startDate | date:'fullDate' }}
                    <small class="tenure-info">({{ calculateTenure() }})</small>
                  </div>
                </div>
                
                <div class="info-item">
                  <label class="info-label">Employee ID</label>
                  <div class="info-value employee-id">{{ currentUser()?.id }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Card -->
          <div class="info-card actions-card" appHighlight="#f8f9fa">
            <div class="card-header">
              <h2 class="card-title">
                <span class="card-icon">⚡</span>
                Quick Actions
              </h2>
            </div>
            <div class="card-body">
              <div class="quick-actions">
                <button class="quick-action-btn email-action" (click)="sendEmail()">
                  <span class="action-icon">📧</span>
                  <span class="action-text">Send Email</span>
                </button>
                
                <button class="quick-action-btn call-action" (click)="makeCall()">
                  <span class="action-icon">📞</span>
                  <span class="action-text">Call</span>
                </button>
                
                <a [routerLink]="['/edit', currentUser()?.id]" class="quick-action-btn edit-action">
                  <span class="action-icon">✏️</span>
                  <span class="action-text">Edit Details</span>
                </a>
                
                <button class="quick-action-btn export-action" (click)="exportUserData()">
                  <span class="action-icon">💾</span>
                  <span class="action-text">Export Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="navigation-section">
          <a routerLink="/users" class="nav-btn back-btn">
            <span class="btn-icon">←</span>
            Back to Users
          </a>
          
          <div class="user-navigation">
            <button class="nav-btn prev-btn" (click)="navigateToPrevious()" [disabled]="!hasPreviousUser()">
              <span class="btn-icon">←</span>
              Previous User
            </button>
            <button class="nav-btn next-btn" (click)="navigateToNext()" [disabled]="!hasNextUser()">
              Next User
              <span class="btn-icon">→</span>
            </button>
          </div>
        </div>
      }

      <!-- Delete Confirmation Modal -->
      @if (showDeleteModal()) {
        <div class="modal-overlay" (click)="cancelDelete()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete 
              <strong>{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</strong>?
            </p>
            <p class="warning-text">This action cannot be undone and will permanently remove all user data.</p>
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
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected userService = inject(UserService);

  // Component state signals
  protected loading = signal(true);
  protected currentUser = signal<User | null>(null);
  protected showDeleteModal = signal(false);
  
  private routeSubscription?: Subscription;

  // Computed signals
  protected userIndex = computed(() => {
    const user = this.currentUser();
    const users = this.userService.users();
    return user ? users.findIndex(u => u.id === user.id) : -1;
  });

  protected hasPreviousUser = computed(() => this.userIndex() > 0);
  protected hasNextUser = computed(() => {
    const index = this.userIndex();
    const totalUsers = this.userService.users().length;
    return index >= 0 && index < totalUsers - 1;
  });

  ngOnInit(): void {
    console.log('UserDetailsComponent initialized');
    this.userService.clearError();
    
    // Subscribe to route parameters
    this.routeSubscription = this.route.params.subscribe(params => {
      const userId = params['id'] ? +params['id'] : 0;
      if (userId) {
        this.loadUser(userId);
      }
    });

    // Load users if not already loaded
    if (this.userService.users().length === 0) {
      this.userService.loadUsers().subscribe();
    }
  }

  ngOnDestroy(): void {
    console.log('UserDetailsComponent destroyed');
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  protected loadUser(userId?: number): void {
    const paramId = this.route.snapshot.params['id'];
    const id = userId || (paramId ? +paramId : 0);
    if (!id) {
      this.router.navigate(['/users']);
      return;
    }

    this.loading.set(true);
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        if (user) {
          this.currentUser.set(user);
          console.log('User details loaded:', user.id);
        } else {
          console.error('User not found:', id);
          this.router.navigate(['/users']);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load user details:', error);
        this.loading.set(false);
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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

  calculateTenure(): string {
    const user = this.currentUser();
    if (!user?.startDate) return '';
    
    const startDate = new Date(user.startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      let tenure = `${years} year${years > 1 ? 's' : ''}`;
      if (remainingMonths > 0) {
        tenure += `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
      }
      return tenure;
    }
  }

  getGoogleMapsUrl(): string {
    const user = this.currentUser();
    if (!user?.address) return '#';
    
    const address = `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}`;
    return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  }

  sendEmail(): void {
    const user = this.currentUser();
    if (user?.email) {
      window.open(`mailto:${user.email}?subject=Hello ${user.firstName}`, '_blank');
    }
  }

  makeCall(): void {
    const user = this.currentUser();
    if (user?.phone) {
      window.open(`tel:${user.phone}`, '_self');
    }
  }

  exportUserData(): void {
    const user = this.currentUser();
    if (!user) return;

    const userData = {
      ...user,
      exportDate: new Date().toISOString(),
      exportedBy: 'User Management Portal'
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `user_${user?.id || 'unknown'}_${user?.firstName || 'unknown'}_${user?.lastName || 'unknown'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  navigateToPrevious(): void {
    const users = this.userService.users();
    const currentIndex = this.userIndex();
    
    if (currentIndex > 0) {
      const previousUser = users[currentIndex - 1];
      this.router.navigate(['/details', previousUser.id]);
    }
  }

  navigateToNext(): void {
    const users = this.userService.users();
    const currentIndex = this.userIndex();
    
    if (currentIndex >= 0 && currentIndex < users.length - 1) {
      const nextUser = users[currentIndex + 1];
      this.router.navigate(['/details', nextUser.id]);
    }
  }

  confirmDelete(): void {
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
  }

  deleteUser(): void {
    const user = this.currentUser();
    if (!user) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        console.log('User deleted successfully:', user.id);
        this.showDeleteModal.set(false);
        this.router.navigate(['/users']);
      },
      error: (error) => {
        console.error('Failed to delete user:', error);
        this.showDeleteModal.set(false);
      }
    });
  }
}