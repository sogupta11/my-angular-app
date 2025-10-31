import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, delay } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/users';
  
  // Signal-based state management
  private _users = signal<User[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _searchTerm = signal<string>('');

  // Public readonly signals
  public readonly users = this._users.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly searchTerm = this._searchTerm.asReadonly();

  // Computed signals
  public readonly filteredUsers = computed(() => {
    const users = this._users();
    const term = this._searchTerm().toLowerCase();
    
    if (!term) {
      return users;
    }
    
    return users.filter(user => 
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.department.toLowerCase().includes(term)
    );
  });

  public readonly totalUsers = computed(() => this._users().length);
  public readonly activeUsers = computed(() => this._users().filter(user => user.isActive).length);

  constructor(private http: HttpClient) {}

  // Mock data for demonstration since we'll simulate a real API
  private generateMockUsers(): User[] {
    return [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1-234-567-8901',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        department: 'Engineering',
        position: 'Senior Developer',
        startDate: '2022-01-15',
        isActive: true
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phone: '+1-234-567-8902',
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210'
        },
        department: 'Marketing',
        position: 'Marketing Manager',
        startDate: '2021-03-20',
        isActive: true
      },
      {
        id: 3,
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@company.com',
        phone: '+1-234-567-8903',
        address: {
          street: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601'
        },
        department: 'Sales',
        position: 'Sales Representative',
        startDate: '2023-06-10',
        isActive: false
      },
      {
        id: 4,
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice.williams@company.com',
        phone: '+1-234-567-8904',
        address: {
          street: '321 Cedar Ln',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001'
        },
        department: 'HR',
        position: 'HR Director',
        startDate: '2020-11-05',
        isActive: true
      },
      {
        id: 5,
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.brown@company.com',
        phone: '+1-234-567-8905',
        address: {
          street: '654 Elm St',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001'
        },
        department: 'Engineering',
        position: 'Frontend Developer',
        startDate: '2023-02-28',
        isActive: true
      }
    ];
  }

  // Load users (simulating API call)
  loadUsers(): Observable<User[]> {
    this._loading.set(true);
    this._error.set(null);

    // Simulate API delay
    return of(this.generateMockUsers()).pipe(
      delay(800),
      tap(users => {
        this._users.set(users);
        this._loading.set(false);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Get user by ID
  getUserById(id: number): Observable<User | undefined> {
    const user = this._users().find(u => u.id === id);
    return of(user).pipe(delay(300));
  }

  // Add new user
  addUser(userData: CreateUserRequest): Observable<User> {
    this._loading.set(true);
    this._error.set(null);

    const newUser: User = {
      ...userData,
      id: Math.max(...this._users().map(u => u.id)) + 1
    };

    return of(newUser).pipe(
      delay(600),
      tap(user => {
        this._users.update(users => [...users, user]);
        this._loading.set(false);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Update user
  updateUser(userData: UpdateUserRequest): Observable<User> {
    this._loading.set(true);
    this._error.set(null);

    return of(userData as User).pipe(
      delay(600),
      tap(updatedUser => {
        this._users.update(users => 
          users.map(user => user.id === updatedUser.id ? updatedUser : user)
        );
        this._loading.set(false);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Delete user
  deleteUser(id: number): Observable<boolean> {
    this._loading.set(true);
    this._error.set(null);

    return of(true).pipe(
      delay(400),
      tap(() => {
        this._users.update(users => users.filter(user => user.id !== id));
        this._loading.set(false);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Update search term
  updateSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  // Clear search
  clearSearch(): void {
    this._searchTerm.set('');
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    this._loading.set(false);
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    this._error.set(errorMessage);
    return throwError(() => errorMessage);
  }

  // Clear error state
  clearError(): void {
    this._error.set(null);
  }
}