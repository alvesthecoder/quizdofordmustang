import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark navbar-mustang fixed-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" routerLink="/start">
          <img src="assets/logo_mustang_header.png" alt="Logo Mustang" class="me-2" style="height: 40px;">
          <span class="fw-bold">Mustang Quiz</span>
        </a>

        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <div class="navbar-nav mx-auto">
            <h4 class="navbar-text text-center mb-0 fw-light text-white">
              60 Anos de História
            </h4>
          </div>

          <div class="navbar-nav ms-auto d-flex align-items-center">
            <span class="navbar-text text-white me-3" *ngIf="currentUser">
              Olá, {{ currentUser.username }}
            </span>

            <div class="d-flex d-lg-none flex-column gap-1">
              <button 
                *ngIf="currentUser"
                class="btn btn-outline-light btn-sm"
                (click)="toggleMusic()"
                [title]="isPlaying ? 'Pausar música' : 'Tocar música'">
                <i [class]="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
              </button>

              <button 
                *ngIf="isAdmin"
                class="btn btn-outline-light btn-sm"
                routerLink="/admin"
                title="Painel Administrativo">
                <i class="fas fa-cog"></i>
              </button>

              <button 
                *ngIf="currentUser"
                class="btn btn-outline-light btn-sm"
                (click)="logout()"
                title="Sair">
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>

            <div class="d-none d-lg-flex flex-row gap-2">
              <button 
                *ngIf="currentUser"
                class="btn btn-outline-light btn-sm"
                (click)="toggleMusic()"
                [title]="isPlaying ? 'Pausar música' : 'Tocar música'">
                <i [class]="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
              </button>

              <button 
                *ngIf="isAdmin"
                class="btn btn-outline-light btn-sm"
                routerLink="/admin"
                title="Painel Administrativo">
                <i class="fas fa-cog"></i>
              </button>

              <button 
                *ngIf="currentUser"
                class="btn btn-outline-light btn-sm"
                (click)="logout()"
                title="Sair">
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <audio #backgroundMusic loop [volume]="0.2" style="display: none;">
      <source src="assets/audio/whiskey_on_the_mississipi.mp3" type="audio/mpeg">
      <source src="assets/audio/background-music.wav" type="audio/wav">
    </audio>

    <div 
      *ngIf="showMusicWarning" 
      class="position-fixed bottom-0 start-50 translate-middle-x mb-3 alert alert-warning alert-dismissible fade show z-3 w-auto px-3 py-2"
      role="alert">
      Clique no botão ▶️ para ativar a música.
      <button type="button" class="btn-close btn-close-white btn-sm ms-2" (click)="showMusicWarning = false"></button>
    </div>
  `,
  styles: [`
    .navbar-mustang {
      background-color: #00274D;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }

    .navbar-brand {
      font-size: 1.5rem;
      text-decoration: none;
    }

    .navbar-brand:hover {
      color: #ffffff !important;
    }

    .btn-outline-light:hover {
      transform: translateY(-1px);
      transition: all 0.3s ease;
    }

    .alert {
      font-size: 0.875rem;
    }
  `]
})
export class HeaderComponent {
  currentUser: User | null = null;
  isAdmin = false;
  isPlaying = false;
  showMusicWarning = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'admin';

      if (user && !this.isPlaying) {
        setTimeout(() => this.startMusic(), 500);
      }
    });
  }

  logout(): void {
    this.stopMusic();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMusic(): void {
    if (this.isPlaying) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  private startMusic(): void {
    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (audio) {
      audio.play().then(() => {
        this.isPlaying = true;
        this.showMusicWarning = false;
      }).catch(() => {
        this.isPlaying = false;
        this.showMusicWarning = true;
      });
    }
  }

  private stopMusic(): void {
    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      this.isPlaying = false;
    }
  }
}