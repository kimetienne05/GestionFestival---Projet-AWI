/**
 * Composant réutilisable représentant un festival sous forme de carte.
 * Reçoit un objet Festival en entrée et transmet son identifiant
 * vers la page de détail.
 *
 * TODO :
 * - Vérifier les données de disponibilité reçues par l'API.
 * - Ajouter éventuellement un indicateur lorsque le festival est complet.
 * - Adapter les informations affichées selon le niveau d'accès.
 */

import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Festival } from '../../features/festivals/festival.types';

@Component({
  selector: 'app-carte-festival',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './carte-festival.html',
  styleUrl: './carte-festival.scss'
})
export class CarteFestivalComponent {
  readonly festival = input.required<Festival>();
}