import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer-mustang mt-auto">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-0 text-white">
              <i class="fas fa-copyright me-1"></i>
              2025 Ford Brasil | Mustang Quiz - 60 Anos de História
            </p>
            <small class="text-light opacity-75">
              Todos os direitos reservados ao Quiz Mustang e à Ford Motor Company
            </small>
          </div>
          
          <div class="col-md-6 text-md-end">
            <div class="social-icons">
              <!-- Facebook -->
              <a href="https://www.facebook.com/ford/?locale=pt_BR" 
                 class="text-white me-3" 
                 title="Facebook"
                 target="_blank" 
                 rel="noopener noreferrer">
                <i class="fab fa-facebook-f fs-5"></i>
              </a>
              
              <!-- Instagram -->
              <a href="https://www.instagram.com/fordbrasil/" 
                 class="text-white me-3" 
                 title="Instagram"
                 target="_blank" 
                 rel="noopener noreferrer">
                <i class="fab fa-instagram fs-5"></i>
              </a>
              
              <!-- Twitter/X -->
              <a href="https://twitter.com/fordbrasil" 
                 class="text-white me-3" 
                 title="Twitter"
                 target="_blank" 
                 rel="noopener noreferrer">
                <i class="fab fa-twitter fs-5"></i>
              </a>
              
              <!-- YouTube -->
              <a href="https://www.youtube.com/@fordbrasil" 
                 class="text-white" 
                 title="YouTube"
                 target="_blank" 
                 rel="noopener noreferrer">
                <i class="fab fa-youtube fs-5"></i>
              </a>
            </div>
            
            <small class="d-block mt-2 text-light opacity-75">
              Desenvolvido com <i class="fas fa-heart text-danger"></i> para os entusiastas
            </small>
            
            <div class="mt-2">
              <a href="https://www.ford.com.br/politica-de-privacidade/" 
                 class="text-light opacity-75 me-3 text-decoration-none"
                 target="_blank" 
                 rel="noopener noreferrer">
                <small>Termos de Serviço</small>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .social-icons a {
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .social-icons a:hover {
      color: var(--mustang-accent) !important;
      transform: translateY(-2px);
    }
    
    .footer-mustang {
      box-shadow: 0 -4px 15px rgba(0, 39, 77, 0.3);
    }
  `]
})
export class FooterComponent {}
