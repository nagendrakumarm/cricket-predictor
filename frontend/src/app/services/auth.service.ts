import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  login(username: string, password: string): boolean {
    if (username === environment.adminUsername && 
        password === environment.adminPassword) {
      sessionStorage.setItem('isAdmin', 'true');
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.removeItem('isAdmin');
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('isAdmin') === 'true';
  }
}