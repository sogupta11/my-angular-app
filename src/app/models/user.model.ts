export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  department: string;
  position: string;
  startDate: string;
  isActive: boolean;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  department: string;
  position: string;
  startDate: string;
  isActive: boolean;
}

export interface UpdateUserRequest extends CreateUserRequest {
  id: number;
}