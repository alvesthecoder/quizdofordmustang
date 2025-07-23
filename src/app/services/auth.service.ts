import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private adminPassword = 'massacinzenta';

  constructor() {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
   
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Verifique se é login de administrador
        if (credentials.username === 'admin') {
          if (credentials.password !== this.adminPassword) {
            throw new Error('Senha incorreta para administrador');
          }
        }
        
        // Permite qualquer nome de usuário para fazer login (exceto administrador com senha incorreta)
        if (credentials.username.trim() === '' || credentials.password.trim() === '') {
          throw new Error('Nome de usuário e senha são obrigatórios');
        }

        // Crie o usuario dinamicamente
        const user: User = {
          id: Date.now(),
          username: credentials.username,
          name: credentials.username === 'admin' ? 'Administrador' : credentials.username,
          role: credentials.username === 'admin' ? 'admin' : 'user',
          createdAt: new Date()
        };

        const response: LoginResponse = {
          user,
          token: this.generateToken(),
          success: true,
          message: 'Login realizado com sucesso!'
        };

        // salvar usuario em localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(user);

        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}