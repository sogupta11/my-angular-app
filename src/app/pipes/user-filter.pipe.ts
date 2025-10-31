import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'userFilter',
  pure: false  // Make it impure to react to array changes
})
export class UserFilterPipe implements PipeTransform {
  transform(users: User[] | null, searchTerm: string): User[] {
    if (!users || !searchTerm) {
      return users || [];
    }
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.department.toLowerCase().includes(term) ||
      user.position.toLowerCase().includes(term)
    );
  }
}