import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { QuizService } from '../../services/quiz.service';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="main-container">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <!-- Seção de Boas-Vindas com logotipo -->
            <div class="mustang-card p-5 mb-4 text-center fade-in">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <img 
                    src="assets/iconford.png" 
                    alt="Logotipo Mustang" 
                    class="img-fluid mb-3" 
                    style="max-width: 120px;"
                  />
                  <h1 class="display-4 fw-bold mb-3">
                    Bem-vindo, {{ currentUser?.username }}!
                  </h1>
                  <p class="lead mb-4">
                    Prepare-se para uma jornada através de 60 anos de história do lendário Ford Mustang.
                    Teste seus conhecimentos sobre o pony car mais icônico do mundo!
                  </p>
                  <button 
                    class="btn btn-mustang btn-lg pulse"
                    (click)="startQuiz()">
                    <i class="fas fa-play me-2"></i>
                    Iniciar Quiz
                  </button>
                </div>

                <!-- Carrossel de modelos 3D -->
                <div class="col-md-6 position-relative">
                  <div id="modelCarousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner model-viewer-container">
                      <div *ngFor="let model of models; let i = index" 
                           class="carousel-item" 
                           [class.active]="i === activeIndex">
                        <model-viewer
                          [src]="model.path"
                          [alt]="model.name"
                          auto-rotate
                          camera-controls
                          interaction-prompt="when-focused"
                          style="width: 100%; height: 400px;"
                          exposure="1"
                          shadow-intensity="1"d
                          environment-image="neutral">
                        </model-viewer>
                        <div class="carousel-caption">
                          <h5>{{model.name}}</h5>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Controles do carrossel - Setas Grandes e Visíveis -->
                    <button class="carousel-control-prev" type="button" data-bs-target="#modelCarousel" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Anterior</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#modelCarousel" data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Próximo</span>
                    </button>
                  </div>
                  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  `,
  styles: [`
    .main-container {
      padding-top: 100px;
    }
    .model-viewer-container {
      width: 100%;
      height: 400px;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    .carousel-control-prev, .carousel-control-next {
      width: 50px;
      height: 50px;
      background-color: var(--mustang-blue);
      border-radius: 50%;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.9;
      transition: all 0.3s ease;
    }
    .carousel-control-prev {
      left: -25px;
    }
    .carousel-control-next {
      right: -25px;
    }
    .carousel-control-prev:hover, .carousel-control-next:hover {
      opacity: 1;
      transform: translateY(-50%) scale(1.1);
    }
    .carousel-caption {
      background-color: rgba(0, 39, 77, 0.8);
      border-radius: 5px;
      padding: 8px 15px;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: auto;
    }
    .btn-outline-mustang {
      border: 1px solid var(--mustang-blue);
      color: var(--mustang-blue);
      background: transparent;
    }
    .btn-outline-mustang:hover {
      background: var(--mustang-blue);
      color: white;
    }
    @media (max-width: 768px) {
      .carousel-control-prev {
        left: 10px;
      }
      .carousel-control-next {
        right: 10px;
      }
    }
  `]
})
export class StartComponent implements OnInit {
  currentUser: User | null = null;
  topScore = 0;
  activeIndex = 0;
  models = [
    { 
      path: 'assets/models_3d/ps1_low-poly_2024_ford_mustang_dark_horse.glb',
      name: 'Mustang Dark Horse 2024'
    },
    { 
      path: 'assets/models_3d/ford_mustang_2005_lowpoly.circ',
      name: 'Mustang GT 2005'
    },
    { 
      path: 'assets/models_3d/low_poly_ford_mustang_65.circ',
      name: 'Mustang 1965'
    }
  ];

  constructor(
    private authService: AuthService,
    private quizService: QuizService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadTopScore();
  }

  goToModel(index: number): void {
    this.activeIndex = index;
  }

  startQuiz(): void {
    if (this.currentUser) {
      this.quizService.createQuizSession(this.currentUser.id).subscribe({
        next: () => this.router.navigate(['/quiz']),
        error: (error) => console.error('Erro ao iniciar quiz:', error)
      });
    }
  }

  private loadTopScore(): void {
    this.quizService.getTopScores(1).subscribe({
      next: (scores) => {
        this.topScore = scores.length > 0 ? scores[0].percentage : 0;
      }
    });
  }
}