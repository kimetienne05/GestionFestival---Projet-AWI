/**
 * Définit les routes de la fonctionnalité festivals.
 * Permet d'accéder à la liste, au détail, à la création
 * et à la modification d'un festival.
 *
 * TODO :
 * - Vérifier les restrictions d'accès pour chaque route.
 * - Vérifier que les actions de création et modification
 *   sont réservées à l'administrateur.
 */

import { Routes } from '@angular/router';
import { niveauGuard } from '../../core/guards/auth.guard';

export const FESTIVALS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./liste-festivals').then((module) => module.ListeFestivalsComponent) },
  { path: 'nouveau', canMatch: [niveauGuard(5)], loadComponent: () => import('./formulaire-festival').then((module) => module.FormulaireFestivalComponent) },
  { path: ':id', loadComponent: () => import('./detail-festival').then((module) => module.DetailFestivalComponent) },
  { path: ':id/modifier', canMatch: [niveauGuard(5)], loadComponent: () => import('./formulaire-festival').then((module) => module.FormulaireFestivalComponent) }
];
