/**
 * Composant de création et de modification d'un festival.
 * Récupère les données saisies et les transmet à FestivalService.
 *
 * TODO :
 * - Charger les données existantes lors d'une modification.
 * - Ajouter le choix d'un festival source pour la copie.
 * - Ajouter les contrôles de cohérence des dates et des surfaces.
 * - Vérifier les formats attendus par l'API.
 */

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FestivalService } from './festival.service';
import { FestivalCreation } from '../../core/models/festival.types';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './formulaire-festival.html'
})
export class FormulaireFestivalComponent {
  private readonly service = inject(FestivalService);
  protected readonly routeur = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly id = Number(this.route.snapshot.paramMap.get('id')) || null;
  protected readonly envoi = signal(false);
  protected readonly erreur = signal('');
  protected donnees: FestivalCreation = {
    nom: '', lieu: '', dateDebut: '', dateFin: '', surfaceTotaleM2: 0, tailleTableM2: 4, prixRepas: '0.00'
  };
  enregistrer(): void {
    this.envoi.set(true);
    const requete = this.id
      ? this.service.modifier(this.id, this.donnees)
      : this.service.creer(this.donnees);
    requete.subscribe({
      next: (festival) => this.routeur.navigate(['/festivals', festival.id]),
      error: (e: { error?: { message?: string } }) => { this.erreur.set(e.error?.message ?? 'Enregistrement impossible.'); this.envoi.set(false); }
    });
  }
}
