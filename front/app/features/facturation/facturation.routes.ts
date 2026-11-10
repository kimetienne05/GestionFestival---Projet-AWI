/**
 * Définit la route de facturation.
 * Autorise actuellement l'accès aux commerciaux et aux trésoriers.
 *
 * TODO :
 * - Vérifier les droits de lecture et d'écriture.
 * - Réserver les opérations de création, annulation et remboursement
 *   au trésorier.
 * - Vérifier les règles de la matrice des droits du DAT.
 */

import { Routes } from '@angular/router';
import { commercialOuTresorierGuard } from '../../core/guards/auth.guard';

export const FACTURATION_ROUTES: Routes = [
  {
    path: '',
    canMatch: [commercialOuTresorierGuard],
    loadComponent: () => import('./facturation-page').then((module) => module.FacturationPageComponent)
  }
];
