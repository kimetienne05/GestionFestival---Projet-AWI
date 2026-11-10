/**
 * Définit les routes principales de l'application.
 * Chaque fonctionnalité est chargée à la demande (lazy loading).
 *
 * TODO :
 * - Vérifier que toutes les routes disposent des gardes adaptés.
 * - Vérifier les droits d'accès selon la matrice du DAT.
 * - Ajouter les éventuelles pages manquantes.
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'connexion',
    loadChildren: () => import('./features/auth/auth.routes').then((module) => module.AUTH_ROUTES)
  },
  {
    path: 'festivals',
    loadChildren: () => import('./features/festivals/festivals.routes').then((module) => module.FESTIVALS_ROUTES)
  },
  {
    path: 'structures',
    loadChildren: () => import('./features/structures/structures.routes').then((module) => module.STRUCTURES_ROUTES)
  },
  {
    path: 'jeux',
    loadChildren: () => import('./features/jeux/jeux.routes').then((module) => module.JEUX_ROUTES)
  },
  {
    path: 'reservations',
    loadChildren: () => import('./features/reservations/reservations.routes').then((module) => module.RESERVATIONS_ROUTES)
  },
  {
    path: 'suivi',
    loadChildren: () => import('./features/suivi/suivi.routes').then((module) => module.SUIVI_ROUTES)
  },
  {
    path: 'facturation',
    loadChildren: () => import('./features/facturation/facturation.routes').then((module) => module.FACTURATION_ROUTES)
  },
  {
    path: 'comptes',
    loadChildren: () => import('./features/comptes/comptes.routes').then((module) => module.COMPTES_ROUTES)
  },
  { path: '', pathMatch: 'full', redirectTo: 'festivals' },
  { path: '**', redirectTo: 'festivals' }
];
