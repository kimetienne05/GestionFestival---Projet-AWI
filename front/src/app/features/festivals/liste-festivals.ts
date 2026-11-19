/**
 * Composant chargé de récupérer et d'afficher la liste des festivals.
 * Utilise FestivalService pour charger les données
 * et CarteFestivalComponent pour représenter chaque festival.
 *
 * TODO :
 * - Ajouter la sélection du festival courant.
 * - Prévoir un tri ou un filtrage si nécessaire.
 * - Améliorer la gestion des erreurs et du chargement.
 */

import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarteFestivalComponent } from '../../shared/carte-festival/carte-festival';
import { FestivalService } from './festival.service';
import { SessionService } from '../../core/services/session.service';
@Component({
  standalone: true,
  imports: [CarteFestivalComponent, RouterLink],
  templateUrl: './liste-festivals.html'
})
export class ListeFestivalsComponent {
  protected readonly service = inject(FestivalService);
  protected readonly session = inject(SessionService);
  protected readonly chargement = signal(true);
  protected readonly erreur = signal('');
  constructor() {
    this.service.chargerFestivals().subscribe({
      next: () => this.chargement.set(false),
      error: () => { this.erreur.set('Impossible de charger les festivals.'); this.chargement.set(false); }
    });
  }
}
