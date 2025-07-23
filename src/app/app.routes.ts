import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'start',
    loadComponent: () => import('./components/start/start.component').then(c => c.StartComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'quiz',
    loadComponent: () => import('./components/quiz/quiz.component').then(c => c.QuizComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'result',
    loadComponent: () => import('./components/result/result.component').then(c => c.ResultComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin.component').then(c => c.AdminComponent),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];