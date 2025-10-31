import { 
  Component, 
  OnInit, 
  OnDestroy, 
  AfterViewInit,
  inject, 
  signal 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User, UpdateUserRequest } from '../../models/user.model';
import { TitleCasePipe } from '../../pipes/title-case.pipe';

@Component({
  selector: 'app-edit-user',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    TitleCasePipe
  ],
  template: `
    <div class="edit-user-container">
      <div class="header-section">
        <div class="breadcrumb">
          <a routerLink="/users">Users</a> 
          <span class="separator">></span> 
          @if (currentUser()) {
            <a [routerLink]="['/details', currentUser()?.id]">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</a>
            <span class="separator">></span>
          }
          <span>Edit</span>
        </div>
        <h2>Edit User</h2>
        @if (currentUser()) {
          <p class="subtitle">
            Update information for {{ (currentUser()?.firstName || '') | titleCase }} {{ (currentUser()?.lastName || '') | titleCase }}
            <span class="user-id">(ID: {{ currentUser()?.id }})</span>
          </p>
        }
      </div>

      @if (loading()) {
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading user data...</p>
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
        <div class="form-container">
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()" novalidate>
            
            <!-- Personal Information Section -->
            <div class="form-section">
              <h3 class="section-title">Personal Information</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName" class="form-label">
                    First Name <span class="required">*</span>
                  </label>
                  <input 
                    id="firstName"
                    type="text" 
                    formControlName="firstName"
                    class="form-control"
                    placeholder="Enter first name"
                    [class.error]="isFieldInvalid('firstName')"
                  >
                  @if (isFieldInvalid('firstName')) {
                    <div class="error-message">
                      @if (userForm.get('firstName')?.errors?.['required']) {
                        First name is required
                      }
                      @if (userForm.get('firstName')?.errors?.['minlength']) {
                        First name must be at least 2 characters
                      }
                    </div>
                  }
                </div>
                
                <div class="form-group">
                  <label for="lastName" class="form-label">
                    Last Name <span class="required">*</span>
                  </label>
                  <input 
                    id="lastName"
                    type="text" 
                    formControlName="lastName"
                    class="form-control"
                    placeholder="Enter last name"
                    [class.error]="isFieldInvalid('lastName')"
                  >
                  @if (isFieldInvalid('lastName')) {
                    <div class="error-message">
                      @if (userForm.get('lastName')?.errors?.['required']) {
                        Last name is required
                      }
                      @if (userForm.get('lastName')?.errors?.['minlength']) {
                        Last name must be at least 2 characters
                      }
                    </div>
                  }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="email" class="form-label">
                    Email Address <span class="required">*</span>
                  </label>
                  <input 
                    id="email"
                    type="email" 
                    formControlName="email"
                    class="form-control"
                    placeholder="Enter email address"
                    [class.error]="isFieldInvalid('email')"
                  >
                  @if (isFieldInvalid('email')) {
                    <div class="error-message">
                      @if (userForm.get('email')?.errors?.['required']) {
                        Email is required
                      }
                      @if (userForm.get('email')?.errors?.['email']) {
                        Please enter a valid email address
                      }
                    </div>
                  }
                </div>
                
                <div class="form-group">
                  <label for="phone" class="form-label">
                    Phone Number <span class="required">*</span>
                  </label>
                  <input 
                    id="phone"
                    type="tel" 
                    formControlName="phone"
                    class="form-control"
                    placeholder="Enter phone number"
                    [class.error]="isFieldInvalid('phone')"
                  >
                  @if (isFieldInvalid('phone')) {
                    <div class="error-message">
                      @if (userForm.get('phone')?.errors?.['required']) {
                        Phone number is required
                      }
                      @if (userForm.get('phone')?.errors?.['pattern']) {
                        Please enter a valid phone number
                      }
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Address Section -->
            <div class="form-section" formGroupName="address">
              <h3 class="section-title">Address Information</h3>
              
              <div class="form-group">
                <label for="street" class="form-label">
                  Street Address <span class="required">*</span>
                </label>
                <input 
                  id="street"
                  type="text" 
                  formControlName="street"
                  class="form-control"
                  placeholder="Enter street address"
                  [class.error]="isFieldInvalid('address.street')"
                >
                @if (isFieldInvalid('address.street')) {
                  <div class="error-message">Street address is required</div>
                }
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city" class="form-label">
                    City <span class="required">*</span>
                  </label>
                  <input 
                    id="city"
                    type="text" 
                    formControlName="city"
                    class="form-control"
                    placeholder="Enter city"
                    [class.error]="isFieldInvalid('address.city')"
                  >
                  @if (isFieldInvalid('address.city')) {
                    <div class="error-message">City is required</div>
                  }
                </div>
                
                <div class="form-group">
                  <label for="state" class="form-label">
                    State <span class="required">*</span>
                  </label>
                  <select 
                    id="state"
                    formControlName="state"
                    class="form-control"
                    [class.error]="isFieldInvalid('address.state')"
                  >
                    <option value="">Select State</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
                  @if (isFieldInvalid('address.state')) {
                    <div class="error-message">State is required</div>
                  }
                </div>
                
                <div class="form-group">
                  <label for="zipCode" class="form-label">
                    ZIP Code <span class="required">*</span>
                  </label>
                  <input 
                    id="zipCode"
                    type="text" 
                    formControlName="zipCode"
                    class="form-control"
                    placeholder="Enter ZIP code"
                    [class.error]="isFieldInvalid('address.zipCode')"
                  >
                  @if (isFieldInvalid('address.zipCode')) {
                    <div class="error-message">
                      @if (userForm.get('address')?.get('zipCode')?.errors?.['required']) {
                        ZIP code is required
                      }
                      @if (userForm.get('address')?.get('zipCode')?.errors?.['pattern']) {
                        Please enter a valid ZIP code
                      }
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Employment Information Section -->
            <div class="form-section">
              <h3 class="section-title">Employment Information</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="department" class="form-label">
                    Department <span class="required">*</span>
                  </label>
                  <select 
                    id="department"
                    formControlName="department"
                    class="form-control"
                    [class.error]="isFieldInvalid('department')"
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Customer Support">Customer Support</option>
                  </select>
                  @if (isFieldInvalid('department')) {
                    <div class="error-message">Department is required</div>
                  }
                </div>
                
                <div class="form-group">
                  <label for="position" class="form-label">
                    Position <span class="required">*</span>
                  </label>
                  <input 
                    id="position"
                    type="text" 
                    formControlName="position"
                    class="form-control"
                    placeholder="Enter position/job title"
                    [class.error]="isFieldInvalid('position')"
                  >
                  @if (isFieldInvalid('position')) {
                    <div class="error-message">Position is required</div>
                  }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="startDate" class="form-label">
                    Start Date <span class="required">*</span>
                  </label>
                  <input 
                    id="startDate"
                    type="date" 
                    formControlName="startDate"
                    class="form-control"
                    [max]="maxDate"
                    [class.error]="isFieldInvalid('startDate')"
                  >
                  @if (isFieldInvalid('startDate')) {
                    <div class="error-message">Start date is required</div>
                  }
                </div>
                
                <div class="form-group">
                  <div class="checkbox-group">
                    <label for="isActive" class="checkbox-label">
                      <input 
                        id="isActive"
                        type="checkbox" 
                        formControlName="isActive"
                        class="checkbox-input"
                      >
                      <span class="checkmark"></span>
                      Active Employee
                    </label>
                    <small class="help-text">Check this if the employee is currently active</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button 
                type="button" 
                class="cancel-btn"
                (click)="onCancel()"
                [disabled]="userService.loading()"
              >
                Cancel
              </button>
              
              <button 
                type="button" 
                class="reset-btn"
                (click)="resetForm()"
                [disabled]="userService.loading() || !hasChanges()"
                title="Reset to original values"
              >
                Reset
              </button>
              
              <button 
                type="submit" 
                class="submit-btn"
                [disabled]="userForm.invalid || userService.loading() || !hasChanges()"
              >
                @if (userService.loading()) {
                  <span class="loading-spinner"></span>
                  Updating User...
                } @else {
                  <span class="btn-icon">💾</span>
                  Update User
                }
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Success Message -->
      @if (showSuccessMessage()) {
        <div class="success-overlay" (click)="hideSuccessMessage()">
          <div class="success-modal" (click)="$event.stopPropagation()">
            <div class="success-icon">✅</div>
            <h3>User Updated Successfully!</h3>
            <p>{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}'s information has been updated.</p>
            <div class="success-actions">
              <button class="success-btn" (click)="goToUserList()">View All Users</button>
              <button class="success-btn secondary" (click)="goToUserDetails()">View Details</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit, OnDestroy, AfterViewInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected userService = inject(UserService);

  // Component state signals
  protected loading = signal(true);
  protected currentUser = signal<User | null>(null);
  protected showSuccessMessage = signal(false);
  private originalFormValue = signal<any>(null);
  
  protected maxDate = new Date().toISOString().split('T')[0];
  
  private routeSubscription?: Subscription;

  userForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\-\(\)\s]{10,15}$/)]],
    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$|^\d{5}$/)]]
    }),
    department: ['', Validators.required],
    position: ['', Validators.required],
    startDate: ['', Validators.required],
    isActive: [true]
  });

  // Lifecycle hook demonstrations
  ngOnInit(): void {
    console.log('EditUserComponent initialized - OnInit lifecycle hook');
    this.userService.clearError();
    
    // Subscribe to route parameters
    this.routeSubscription = this.route.params.subscribe(params => {
      const userId = params['id'] ? +params['id'] : 0;
      if (userId) {
        this.loadUser(userId);
      }
    });
  }

  ngAfterViewInit(): void {
    console.log('EditUserComponent view initialized - AfterViewInit lifecycle hook');
    // Focus on first input after view init
    setTimeout(() => {
      const firstInput = document.querySelector('#firstName') as HTMLInputElement;
      if (firstInput && !this.loading()) {
        firstInput.focus();
      }
    });
  }

  ngOnDestroy(): void {
    console.log('EditUserComponent destroyed - OnDestroy lifecycle hook');
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.userService.clearError();
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
          this.populateForm(user);
          console.log('User data loaded successfully:', user.id);
        } else {
          console.error('User not found:', id);
          this.router.navigate(['/users']);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load user:', error);
        this.loading.set(false);
      }
    });
  }

  private populateForm(user: User): void {
    const formValue = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: {
        street: user.address.street,
        city: user.address.city,
        state: user.address.state,
        zipCode: user.address.zipCode
      },
      department: user.department,
      position: user.position,
      startDate: user.startDate,
      isActive: user.isActive
    };

    this.userForm.patchValue(formValue);
    this.originalFormValue.set({ ...formValue });
    
    // Mark form as pristine after populating
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.getField(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private getField(fieldName: string) {
    const parts = fieldName.split('.');
    let control: any = this.userForm;
    
    for (const part of parts) {
      control = control.get(part);
      if (!control) break;
    }
    
    return control;
  }

  hasChanges(): boolean {
    const original = this.originalFormValue();
    const current = this.userForm.value;
    return original ? JSON.stringify(original) !== JSON.stringify(current) : false;
  }

  onSubmit(): void {
    if (this.userForm.invalid || !this.currentUser()) {
      this.markAllFieldsAsTouched();
      return;
    }

    const formValue = this.userForm.value;
    const userData: UpdateUserRequest = {
      id: this.currentUser()!.id,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      address: {
        street: formValue.address.street,
        city: formValue.address.city,
        state: formValue.address.state,
        zipCode: formValue.address.zipCode
      },
      department: formValue.department,
      position: formValue.position,
      startDate: formValue.startDate,
      isActive: formValue.isActive
    };

    this.userService.updateUser(userData).subscribe({
      next: (user) => {
        console.log('User updated successfully:', user);
        this.currentUser.set(user);
        this.originalFormValue.set({ ...formValue });
        this.userForm.markAsPristine();
        this.showSuccessMessage.set(true);
      },
      error: (error) => {
        console.error('Failed to update user:', error);
      }
    });
  }

  resetForm(): void {
    const original = this.originalFormValue();
    if (original) {
      this.userForm.patchValue(original);
      this.userForm.markAsPristine();
      this.userForm.markAsUntouched();
    }
  }

  onCancel(): void {
    if (this.hasChanges()) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        this.goBack();
      }
    } else {
      this.goBack();
    }
  }

  private goBack(): void {
    const user = this.currentUser();
    if (user) {
      this.router.navigate(['/details', user.id]);
    } else {
      this.router.navigate(['/users']);
    }
  }

  goToUserList(): void {
    this.hideSuccessMessage();
    this.router.navigate(['/users']);
  }

  goToUserDetails(): void {
    this.hideSuccessMessage();
    const user = this.currentUser();
    if (user) {
      this.router.navigate(['/details', user.id]);
    }
  }

  hideSuccessMessage(): void {
    this.showSuccessMessage.set(false);
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
      
      if (control && 'controls' in control) {
        Object.keys((control as any).controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
    });
  }
}