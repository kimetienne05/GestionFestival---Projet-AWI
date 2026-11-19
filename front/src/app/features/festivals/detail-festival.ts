/**
 * Composant chargé d'afficher le détail d'un festival.
 * Récupère les informations du festival, ses zones tarifaires
 * et ses zones du plan.
 * Permet également à l'administrateur de supprimer le festival.
 *
 * TODO :
 * - Ajouter la gestion complète des zones tarifaires.
 * - Ajouter la gestion complète des zones du plan.
 * - Ajouter les contrôles de suppression et les messages d'erreur.
 * - Ajouter les informations complémentaires du festival.
 */

import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FestivalService } from './festival.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './detail-festival.html'
})
export class DetailFestivalComponent {
  protected readonly service = inject(FestivalService);
  protected readonly session = inject(SessionService);
  protected readonly chargement = signal(true);
  protected readonly erreur = signal('');
  protected readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  constructor() {
    this.service.chargerFestival(this.id).subscribe({
      next: () => this.chargement.set(false),
      error: () => { this.erreur.set('Festival introuvable.'); this.chargement.set(false); }
    });
    this.service.chargerZonesTarifaires(this.id).subscribe();
    this.service.chargerZonesPlan(this.id).subscribe();
  }
  supprimer(): void {
    if (!confirm('Supprimer ce festival ? Cette action est définitive.')) return;
    this.service.supprimer(this.id).subscribe({ next: () => history.back() });
  }
}
