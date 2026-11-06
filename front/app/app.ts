import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SessionService } from './core/services/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html'
})
export class AppComponent {
  protected readonly session = inject(SessionService);
  constructor() { this.session.chargerSession().subscribe(); }
  protected readonly liens = [
    { url: '/festivals', libelle: 'Festivals', niveau: 1 },
    { url: '/structures', libelle: 'Structures', niveau: 1 },
    { url: '/jeux', libelle: 'Jeux', niveau: 1 },
    { url: '/reservations', libelle: 'Réservations', niveau: 4 },
    { url: '/suivi', libelle: 'Suivi', niveau: 4 },
    { url: '/facturation', libelle: 'Facturation', niveau: 4 },
    { url: '/comptes', libelle: 'Comptes', niveau: 5 }
  ];
}
