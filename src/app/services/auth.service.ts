import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private adminPassword = 'massacinzenta';
  private registeredUsers: any[] = []; // Usamos any para armazenar campos extras

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    // CARREGA USUARIO LOGADO DO LOCALSTORAGE
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }

    // CARREGA USUARIOS REGISTRADOS DO LOCALSTORAGE
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
      this.registeredUsers = JSON.parse(savedUsers);
    }

    // GARANTE QUE O USUARIO ADMIN EXISTE NO SISTEMA
    if (!this.registeredUsers.some(u => u.username === 'admin')) {
      this.registeredUsers.push({
        id: 1,
        username: 'admin',
        name: 'Administrador',
        password: this.adminPassword,
        role: 'admin',
        createdAt: new Date()
      });
      this.saveRegisteredUsers();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // LOGIN DO ADMIN COM COMPATIBILIDADE
        if (credentials.username === 'admin') {
          if (credentials.password !== this.adminPassword) {
            throw new Error('Senha incorreta para administrador');
          }
          const admin = this.registeredUsers.find(u => u.username === 'admin');
          return this.createAuthResponse(this.mapToUser(admin));
        }

        // LOGIN NORMAL ACEITA EMAIL OU USERNAME
        const user = this.registeredUsers.find(u => 
          (u.username === credentials.username || u.email === credentials.username) && 
          u.password === credentials.password
        );

        if (!user) {
          throw new Error('Credenciais inválidas');
        }

        return this.createAuthResponse(this.mapToUser(user));
      })
    );
  }

  register(credentials: any): Observable<LoginResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // VALIDACAO DOS CAMPOS OBRIGATORIOS
        if (!credentials.username || !credentials.password || !credentials.name || !credentials.email) {
          throw new Error('Todos os campos são obrigatórios');
        }

        // VERIFICA SE USUARIO OU EMAIL JA EXISTEM
        if (this.registeredUsers.some(u => u.username === credentials.username)) {
          throw new Error('Nome de usuário já existe');
        }

        if (this.registeredUsers.some(u => u.email === credentials.email)) {
          throw new Error('Email já cadastrado');
        }

        // CRIA NOVO USUARIO COM TODOS OS CAMPOS
        const newUser = {
          id: Date.now(),
          username: credentials.username,
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          role: 'user',
          createdAt: new Date(),
          ...credentials
        };

        this.registeredUsers.push(newUser);
        this.saveRegisteredUsers();

        return this.createAuthResponse(this.mapToUser(newUser));
      })
    );
  }

  resetPassword(identifier: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // VALIDACAO DOS CAMPOS
        if (!identifier || !newPassword) {
          throw new Error('Email/usuário e nova senha são obrigatórios');
        }

        if (newPassword.length < 4) {
          throw new Error('A nova senha deve ter pelo menos 4 caracteres');
        }

        // BUSCA USUARIO POR EMAIL OU USERNAME
        const userIndex = this.registeredUsers.findIndex(u => 
          u.email === identifier || u.username === identifier
        );

        if (userIndex === -1) {
          throw new Error('Usuário não encontrado');
        }

        // ATUALIZA A SENHA DO USUARIO
        this.registeredUsers[userIndex].password = newPassword;
        this.saveRegisteredUsers();

        return {
          success: true,
          message: 'Senha redefinida com sucesso!'
        };
      })
    );
  }
  private mapToUser(data: any): User {
    // FILTRA APENAS OS CAMPOS DA INTERFACE USER
    return {
      id: data.id,
      username: data.username,
      name: data.name,
      role: data.role,
      createdAt: data.createdAt
    };
  }

  private createAuthResponse(user: User): LoginResponse {
    const response: LoginResponse = {
      user,
      token: this.generateToken(),
      success: true,
      message: 'Operação realizada com sucesso!'
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', response.token);
    this.currentUserSubject.next(user);

    return response;
  }

  private saveRegisteredUsers(): void {
    localStorage.setItem('registeredUsers', JSON.stringify(this.registeredUsers));
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  // METODOS DE CONTROLE DE SESSAO
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

  // Método para verificar se o usuário atual pode fazer quiz
  canTakeQuiz(): boolean {
    return this.isLoggedIn(); // Tanto admin quanto usuário normal podem fazer quiz
  }
}