import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterModule } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { routes } from './app/app.routes';
import { HeaderComponent } from './app/components/header/header.component';
import { FooterComponent } from './app/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <app-header></app-header>
      <main class="flex-grow-1">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(ReactiveFormsModule, FormsModule)
  ]
}).catch(err => console.error(err));