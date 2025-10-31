import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CreateUserRequest } from '../../models/user.model';


@Component({
  selector: 'app-add-user',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink
  ],
  template: `
    <div class="add-user-container">
      <div class="header-section">
        <div class="breadcrumb">
          <a routerLink="/users">Users</a> <span class="separator">></span> <span>Add New User</span>
        </div>
        <h2>Add New User</h2>
        <p class="subtitle">Fill in the details to create a new user account</p>
      </div>

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
            
            <!-- Debug button - remove this after testing -->
            <button 
              type="button" 
              class="debug-btn"
              (click)="debugForm()"
              style="background: orange; color: white; padding: 0.5rem; border: none; border-radius: 4px; margin-right: 0.5rem;"
            >
              Debug Form
            </button>
            
            <button 
              type="submit" 
              class="submit-btn"
              [disabled]="userForm.invalid || userService.loading()"
            >
              @if (userService.loading()) {
                <span class="loading-spinner"></span>
                Creating User...
              } @else {
                <span class="btn-icon">✓</span>
                Create User
              }
            </button>
          </div>
        </form>
      </div>

      <!-- Success Message -->
      @if (showSuccessMessage()) {
        <div class="success-overlay" (click)="hideSuccessMessage()">
          <div class="success-modal" (click)="$event.stopPropagation()">
            <div class="success-icon">✅</div>
            <h3>User Created Successfully!</h3>
            <p>{{ lastCreatedUser()?.firstName }} {{ lastCreatedUser()?.lastName }} has been added to the system.</p>
            <div class="success-actions">
              <button class="success-btn" (click)="goToUserList()">View All Users</button>
              <button class="success-btn secondary" (click)="createAnother()">Create Another</button>
            </div>
          </div>
        </div>
      }

      <!-- Error Display -->
      @if (userService.error()) {
        <div class="error-banner">
          <strong>Error:</strong> {{ userService.error() }}
          <button class="close-error-btn" (click)="clearError()">×</button>
        </div>
      }
    </div>
  `,
  styleUrl: './add-user.component.css'
})
export class AddUserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  protected userService = inject(UserService);

  // Component state signals
  protected showSuccessMessage = signal(false);
  protected lastCreatedUser = signal<any>(null);
  
  protected maxDate = new Date().toISOString().split('T')[0]; // Today's date

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

  ngOnInit(): void {
    console.log('AddUserComponent initialized');
    this.userService.clearError();
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

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    const formValue = this.userForm.value;
    const userData: CreateUserRequest = {
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

    this.userService.addUser(userData).subscribe({
      next: (user) => {
        console.log('User created successfully:', user);
        this.lastCreatedUser.set(user);
        this.showSuccessMessage.set(true);
        this.resetForm();
      },
      error: (error) => {
        console.error('Failed to create user:', error);
        // Error is handled by the service
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  goToUserList(): void {
    this.hideSuccessMessage();
    this.router.navigate(['/users']);
  }

  createAnother(): void {
    this.hideSuccessMessage();
    this.resetForm();
  }

  hideSuccessMessage(): void {
    this.showSuccessMessage.set(false);
    this.lastCreatedUser.set(null);
  }

  clearError(): void {
    this.userService.clearError();
  }

  debugForm(): void {
    console.log('Form valid:', this.userForm.valid);
    console.log('Form errors:', this.userForm.errors);
    
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control?.invalid) {
        console.log(`${key} is invalid:`, control.errors);
        
        // Check nested controls
        if (control && 'controls' in control) {
          Object.keys((control as any).controls).forEach(nestedKey => {
            const nestedControl = control.get(nestedKey);
            if (nestedControl?.invalid) {
              console.log(`  ${key}.${nestedKey} is invalid:`, nestedControl.errors);
            }
          });
        }
      }
    });
  }

  private resetForm(): void {
    this.userForm.reset({
      isActive: true // Default to active
    });
    this.userForm.markAsUntouched();
    this.userForm.markAsPristine();
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
      
      if (control && 'controls' in control) {
        // Handle nested form groups
        Object.keys((control as any).controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
    });
  }
}