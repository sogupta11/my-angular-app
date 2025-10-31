import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailDomain',
  pure: true
})
export class EmailDomainPipe implements PipeTransform {
  transform(email: string | undefined | null): string {
    if (!email || !email.includes('@')) return '';
    
    return email.split('@')[1];
  }
}