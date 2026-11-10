/**
 * Définit les gardes de navigation Angular.
 * Vérifie si l'utilisateur est connecté et si son niveau hiérarchique
 * lui permet d'accéder à une fonctionnalité.
 * Un garde spécifique est également prévu pour le trésorier.
 *
 * TODO :
 * - Vérifier les droits de chaque route avec la matrice du DAT.
 * - Distinguer les accès en lecture et en écriture.
 * - Adapter les accès combinant niveau hiérarchique et rôle trésorier.
 *
 * IMPORTANT :
 * Ces gardes contrôlent uniquement la navigation côté front-end.
 * La vérification réelle des permissions doit être effectuée par le back-end.
 */

import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { SessionService } from '../services/session.service';

export const authentifieGuard: CanMatchFn = () => {
  const session = inject(SessionService);
  const routeur = inject(Router);
  return session.chargerSession().pipe(
    map((compte) => compte
      ? true
      : routeur.createUrlTree(['/connexion'], { queryParams: { retour: routeur.url } }))
  );
};

export const niveauGuard = (niveau: number): CanMatchFn => () => {
  const session = inject(SessionService);
  const routeur = inject(Router);
  return session.chargerSession().pipe(
    map((compte) => {
      if (compte && compte.niveau >= niveau) return true;
      return compte ? routeur.createUrlTree(['/festivals']) : routeur.createUrlTree(['/connexion']);
    })
  );
};

export const tresorierGuard: CanMatchFn = () => {
  const session = inject(SessionService);
  const routeur = inject(Router);
  return session.chargerSession().pipe(
    map((compte) => {
      if (compte?.estTresorier) return true;
      return compte ? routeur.createUrlTree(['/festivals']) : routeur.createUrlTree(['/connexion']);
    })
  );
};

/** Accès en lecture aux factures : commercial (niveau 4) ou trésorier. */
export const commercialOuTresorierGuard: CanMatchFn = () => {
  const session = inject(SessionService);
  const routeur = inject(Router);
  return session.chargerSession().pipe(
    map((compte) => {
      if (compte && (compte.niveau >= 4 || compte.estTresorier)) return true;
      return compte ? routeur.createUrlTree(['/festivals']) : routeur.createUrlTree(['/connexion']);
    })
  );
};
