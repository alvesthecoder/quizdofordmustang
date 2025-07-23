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
                    Bem-vindo, {{ currentUser?.name }}!
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

                <!-- Visualização 3D interativa do Mustang -->
                <div class="col-md-6">
                  <div class="model-viewer-container">
                    <model-viewer
                      src="assets/models_3d/ps1_low-poly_2024_ford_mustang_dark_horse.circ"
                      alt="Modelo 3D do Mustang"
                      auto-rotate
                      camera-controls
                      interaction-prompt="when-focused"
                      style="width: 100%; height: 400px;"
                      exposure="1"
                      shadow-intensity="1"
                      environment-image="neutral"
                      disable-zoom="false">
                    </model-viewer>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estatísticas principais -->
            <div class="row mb-4">
              <div class="col-md-4">
                <div class="mustang-card p-4 text-center">
                  <i class="fas fa-question-circle fs-2 text-primary mb-3"></i>
                  <h3 class="fw-bold">15</h3>
                  <p class="text-muted mb-0">Perguntas Desafiadoras</p>
                </div>
              </div>

              <div class="col-md-4">
                <div class="mustang-card p-4 text-center">
                  <i class="fas fa-clock fs-2 text-warning mb-3"></i>
                  <h3 class="fw-bold">15s</h3>
                  <p class="text-muted mb-0">Por Pergunta</p>
                </div>
              </div>

              <div class="col-md-4">
                <div class="mustang-card p-4 text-center">
                  <i class="fas fa-trophy fs-2 text-success mb-3"></i>
                  <h3 class="fw-bold">{{ topScore }}%</h3>
                  <p class="text-muted mb-0">Melhor Pontuação</p>
                </div>
              </div>
            </div>

            <!-- Funcionalidades do Quiz -->
            <div class="mustang-card p-4">
              <h3 class="fw-bold mb-4 text-center">
                <i class="fas fa-star me-2"></i>
                O que você encontrará no quiz
              </h3>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <div class="d-flex align-items-start">
                    <i class="fas fa-cube text-primary fs-4 me-3 mt-1"></i>
                    <div>
                      <h5 class="fw-semibold">Modelos 3D Interativos</h5>
                      <p class="text-muted mb-0">
                        Explore modelos tridimensionais dos Mustangs mais icônicos da história.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <div class="d-flex align-items-start">
                    <i class="fas fa-history text-primary fs-4 me-3 mt-1"></i>
                    <div>
                      <h5 class="fw-semibold">60 Anos de História</h5>
                      <p class="text-muted mb-0">
                        Desde 1964 até os dias atuais, descubra curiosidades fascinantes.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <div class="d-flex align-items-start">
                    <i class="fas fa-brain text-primary fs-4 me-3 mt-1"></i>
                    <div>
                      <h5 class="fw-semibold">Curiosidades Exclusivas</h5>
                      <p class="text-muted mb-0">
                        Aprenda fatos únicos sobre cada era do Mustang.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <div class="d-flex align-items-start">
                    <i class="fas fa-medal text-primary fs-4 me-3 mt-1"></i>
                    <div>
                      <h5 class="fw-semibold">Certificado PDF</h5>
                      <p class="text-muted mb-0">
                        Receba um certificado personalizado com seus resultados.
                      </p>
                    </div>
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
    }
  `]
})
export class StartComponent implements OnInit {
  currentUser: User | null = null;
  topScore = 0;
  modelUrl: string = 'assets/models/mustang.glb';

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
