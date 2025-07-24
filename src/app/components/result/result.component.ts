import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { QuizResult } from '../../models/result.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="main-container">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">

            <!-- display de pontos -->
            <div class="score-display mb-4 fade-in text-white">
              <i class="fas fa-trophy fs-1 mb-3 text-warning"></i>
              <h1 class="display-4 fw-bold mb-3">Quiz Concluído!</h1>
              <h2 class="mb-3">{{ result?.score }} / {{ result?.totalQuestions }}</h2>
              <h3 class="mb-3">{{ result?.percentage }}% de Acertos</h3>
              <p class="lead mb-0">{{ getPerformanceMessage() }}</p>
            </div>

            <!-- seção do modelo 3d-->
            <div class="mustang-card p-5 mb-4 text-center">
              <h3 class="fw-bold mb-4">
                <i class="fas fa-award me-2"></i>
                Seu Mustang de Conquista
              </h3>
              <div class="row align-items-center">
                <div class="col-md-6">
                  <div class="model-viewer-container">
                    <model-viewer
                      src="assets/models_3d/ps1_low-poly_2024_ford_mustang_dark_horse.glb"
                      [alt]="'Mustang ' + getMustangYear()"
                      auto-rotate
                      camera-controls
                      interaction-prompt="none">
                    </model-viewer>
                  </div>
                </div>
                <div class="col-md-6">
                  <h4 class="fw-bold mb-3">{{ getMustangModel() }}</h4>
                  <p class="lead mb-3">{{ getMustangDescription() }}</p>
                  <div class="d-flex justify-content-center gap-3">
                    <button class="btn btn-mustang" (click)="exportToPDF()">
                      <i class="fas fa-download me-2"></i>
                      Baixar Certificado
                    </button>
                    <button class="btn btn-mustang-outline" routerLink="/start">
                      <i class="fas fa-redo me-2"></i>
                      Fazer Novamente
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- resultados detalhados -->
            <div class="mustang-card p-4 mb-4" *ngIf="result">
              <h4 class="fw-bold mb-4">
                <i class="fas fa-chart-line me-2"></i>
                Desempenho Detalhado
              </h4>
              
              <div class="row mb-4">
                <div class="col-md-3 text-center">
                  <div class="border rounded p-3">
                    <i class="fas fa-clock text-primary fs-3 mb-2"></i>
                    <h5 class="fw-bold">{{ formatTime(result.timeSpent) }}</h5>
                    <small class="text-muted">Tempo Total</small>
                  </div>
                </div>
                
                <div class="col-md-3 text-center">
                  <div class="border rounded p-3">
                    <i class="fas fa-check-circle text-success fs-3 mb-2"></i>
                    <h5 class="fw-bold">{{ result.score }}</h5>
                    <small class="text-muted">Acertos</small>
                  </div>
                </div>
                
                <div class="col-md-3 text-center">
                  <div class="border rounded p-3">
                    <i class="fas fa-times-circle text-danger fs-3 mb-2"></i>
                    <h5 class="fw-bold">{{ result.totalQuestions - result.score }}</h5>
                    <small class="text-muted">Erros</small>
                  </div>
                </div>
                
                <div class="col-md-3 text-center">
                  <div class="border rounded p-3">
                    <i class="fas fa-percentage text-info fs-3 mb-2"></i>
                    <h5 class="fw-bold">{{ result.percentage }}%</h5>
                    <small class="text-muted">Aproveitamento</small>
                  </div>
                </div>
              </div>

              <!-- barra de prograssão -->
              <div class="mb-4">
                <div class="d-flex justify-content-between mb-2">
                  <span class="fw-semibold">Aproveitamento Geral</span>
                  <span class="fw-semibold">{{ result.percentage }}%</span>
                </div>
                <div class="progress" style="height: 12px;">
                  <div 
                    class="progress-bar"
                    [class.bg-danger]="result.percentage < 50"
                    [class.bg-warning]="result.percentage >= 50 && result.percentage < 70"
                    [class.bg-success]="result.percentage >= 70"
                    [style.width.%]="result.percentage">
                  </div>
                </div>
              </div>

              <!-- Respostas Detalhadas -->
              <h5 class="fw-bold mb-3">Respostas Detalhadas</h5>
              <div class="accordion" id="answersAccordion">
                <div 
                  *ngFor="let answer of result.answers; let i = index"
                  class="accordion-item">
                  <h2 class="accordion-header">
                    <button 
                      class="accordion-button collapsed"
                      type="button"
                      [attr.data-bs-toggle]="'collapse'"
                      [attr.data-bs-target]="'#answer' + i">
                      <span class="me-2">
                        <i [class]="answer.isCorrect ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger'"></i>
                      </span>
                      Pergunta {{ i + 1 }}: {{ answer.question }}
                    </button>
                  </h2>
                  <div 
                    [id]="'answer' + i"
                    class="accordion-collapse collapse"
                    data-bs-parent="#answersAccordion">
                    <div class="accordion-body">
                      <div class="row">
                        <div class="col-md-6">
                          <p><strong>Sua resposta:</strong> 
                            <span [class]="answer.isCorrect ? 'text-success' : 'text-danger'">
                              {{ answer.selectedAnswer }}
                            </span>
                          </p>
                          <p><strong>Resposta correta:</strong> 
                            <span class="text-success">{{ answer.correctAnswer }}</span>
                          </p>
                        </div>
                        <div class="col-md-6">
                          <p><strong>Tempo gasto:</strong> {{ answer.timeSpent }}s</p>
                          <p><strong>Status:</strong> 
                            <span [class]="answer.isCorrect ? 'text-success' : 'text-danger'">
                              {{ answer.isCorrect ? 'Correto' : 'Incorreto' }}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- botoes de ação -->
            <div class="text-center">
              <button class="btn btn-mustang me-3" routerLink="/start">
                <i class="fas fa-home me-2"></i>
                Voltar ao Início
              </button>
              <button class="btn btn-mustang-outline" (click)="exportToPDF()">
                <i class="fas fa-file-pdf me-2"></i>
                Gerar Certificado PDF
              </button>
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
    
    .accordion-button:not(.collapsed) {
      background-color: var(--mustang-gray);
      border-color: var(--mustang-blue);
    }
  `]
})
export class ResultComponent implements OnInit {
  result: QuizResult | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.result = navigation.extras.state['result'];
    }
  }

  ngOnInit(): void {
    if (!this.result) {
      this.router.navigate(['/start']);
    }
  }

  getPerformanceMessage(): string {
    if (!this.result) return '';
    
    const percentage = this.result.percentage;
    
    if (percentage >= 90) {
      return 'Excelente! Você é um verdadeiro especialista em Mustang!';
    } else if (percentage >= 70) {
      return 'Muito bom! Você conhece bem a história do Mustang.';
    } else if (percentage >= 50) {
      return 'Bom trabalho! Continue estudando sobre o Mustang.';
    } else {
      return 'Não desanime! Que tal tentar novamente?';
    }
  }

  getMustangModel(): string {
    if (!this.result) return '';
    
    const percentage = this.result.percentage;
    
    if (percentage >= 90) {
      return 'Mustang Shelby GT500 (2020)';
    } else if (percentage >= 70) {
      return 'Mustang GT (2018)';
    } else if (percentage >= 50) {
      return 'Mustang EcoBoost (2015)';
    } else {
      return 'Mustang V6 (2010)';
    }
  }

  getMustangYear(): string {
    if (!this.result) return '2020';
    
    const percentage = this.result.percentage;
    
    if (percentage >= 90) return '2020';
    if (percentage >= 70) return '2018';
    if (percentage >= 50) return '2015';
    return '2010';
  }

  getMustangDescription(): string {
    if (!this.result) return '';
    
    const percentage = this.result.percentage;
    
    if (percentage >= 90) {
      return 'O mais potente e avançado Mustang de todos os tempos, com 760 hp de pura potência americana.';
    } else if (percentage >= 70) {
      return 'Um clássico moderno com motor V8 Coyote 5.0L, perfeito equilíbrio entre tradição e performance.';
    } else if (percentage >= 50) {
      return 'Eficiência e esportividade reunidas no motor EcoBoost turbo de 2.3L.';
    } else {
      return 'Um Mustang confiável e acessível para começar sua jornada no mundo dos pony cars.';
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  exportToPDF(): void {
    if (!this.result) return;

    const pdf = new jsPDF();
    
    pdf.setFillColor(0, 39, 77);
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CERTIFICADO DE CONCLUSÃO', 105, 20, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Mustang Quiz - 60 Anos de História', 105, 30, { align: 'center' });
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    
    const yStart = 60;
    let currentY = yStart;
    
    pdf.text('Certificamos que:', 20, currentY);
    currentY += 15;
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(this.result.userName || 'Participante', 20, currentY);
    currentY += 20;
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Concluiu com sucesso o Quiz sobre a história do Ford Mustang', 20, currentY);
    currentY += 10;
    pdf.text('demonstrando conhecimento sobre 60 anos de tradição automotiva.', 20, currentY);
    currentY += 25;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('RESULTADOS:', 20, currentY);
    currentY += 15;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Pontuação: ${this.result.score} de ${this.result.totalQuestions} questões`, 20, currentY);
    currentY += 10;
    pdf.text(`Aproveitamento: ${this.result.percentage}%`, 20, currentY);
    currentY += 10;
    pdf.text(`Tempo total: ${this.formatTime(this.result.timeSpent)}`, 20, currentY);
    currentY += 10;
    pdf.text(`Data de conclusão: ${new Date(this.result.completedAt).toLocaleDateString('pt-BR')}`, 20, currentY);
    currentY += 25;

    pdf.setFont('helvetica', 'bold');
    pdf.text('SEU MUSTANG DE CONQUISTA:', 20, currentY);
    currentY += 15;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(this.getMustangModel(), 20, currentY);
    currentY += 10;
    pdf.text(this.getMustangDescription(), 20, currentY, { maxWidth: 170 });
    
    pdf.setFillColor(0, 39, 77);
    pdf.rect(0, 270, 210, 27, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text('© 2025 Mustang Quiz - Celebrando 60 Anos de História', 105, 285, { align: 'center' });
    
    pdf.save(`Certificado_Mustang_Quiz_${this.result.percentage}%.pdf`);
  }
}