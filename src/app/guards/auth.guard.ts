import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // VERIFICA SE O USUÁRIO É ADMIN
    // Se a rota requer admin e o usuário não é admin, redireciona para a página inicial 
    if (route.data?.['requiresAdmin'] && !this.authService.isAdmin()) {
      this.router.navigate(['/start']);
      return false;
    }

    return true;
  }
}