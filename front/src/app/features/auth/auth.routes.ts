/**
 * Définit les routes de la fonctionnalité d'authentification.
 * Charge le composant de connexion.
 *
 * TODO :
 * - Ajouter la route de changement de mot de passe.
 * - Ajouter les éventuelles pages liées à la gestion du compte.
 */

import { Routes } from '@angular/router';
export const AUTH_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./connexion').then((module) => module.ConnexionComponent) }
];
