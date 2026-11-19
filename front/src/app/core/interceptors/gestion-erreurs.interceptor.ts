/**
 * Intercepteur HTTP chargé de traiter les erreurs renvoyées par l'API.
 * Les messages techniques du serveur ne sont jamais exposés à l'utilisateur.
 */

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { SessionService } from '../services/session.service';

function lireMessage(erreur: HttpErrorResponse): string | null {
  const corps = erreur.error as { message?: unknown } | null;
  return typeof corps?.message === 'string' && corps.message.trim() !== ''
    ? corps.message
    : null;
}

export const gestionErreursInterceptor: HttpInterceptorFn = (requete, suivant) => {
  const routeur = inject(Router);
  const notifications = inject(NotificationService);
  const session = inject(SessionService);

  return suivant(requete).pipe(
    catchError((erreur: HttpErrorResponse) => {
      const messageApi = lireMessage(erreur);

      if (erreur.status === 401) {
        // Ces deux réponses sont traitées par les composants/services d'authentification.
        // En particulier, /auth/moi renvoie normalement 401 pour un visiteur.
        const estConnexion = requete.url.endsWith('/auth/connexion');
        const estRestaurationSession = requete.url.endsWith('/auth/moi');

        if (!estConnexion && !estRestaurationSession) {
          session.viderSession();
          notifications.afficher(messageApi ?? 'Votre session a expiré. Veuillez vous reconnecter.');
          if (!routeur.url.startsWith('/connexion')) {
            void routeur.navigate(['/connexion']);
          }
        }
      } else if (erreur.status === 400) {
        notifications.afficher(messageApi ?? 'Les données saisies sont invalides.');
      } else if (erreur.status === 403) {
        notifications.afficher(messageApi ?? 'Vous ne disposez pas des droits nécessaires.');
      } else if (erreur.status === 404) {
        notifications.afficher(messageApi ?? 'La ressource demandée est introuvable.');
      } else if (erreur.status === 409) {
        notifications.afficher(messageApi ?? 'Cette action est incompatible avec l’état actuel des données.');
      } else if (erreur.status === 413) {
        notifications.afficher(messageApi ?? 'Le fichier PDF est trop volumineux.');
      } else if (erreur.status === 429) {
        notifications.afficher(messageApi ?? 'Trop de requêtes. Veuillez réessayer dans quelques instants.');
      } else if (erreur.status === 503) {
        notifications.afficher(messageApi ?? 'Le service est temporairement indisponible.');
      } else if (erreur.status >= 500) {
        // Ne jamais afficher les détails techniques d'une erreur serveur.
        notifications.afficher('Le serveur rencontre un problème. Réessayez plus tard.');
      } else if (erreur.status === 0) {
        notifications.afficher('Impossible de joindre le serveur. Vérifiez votre connexion.');
      }

      return throwError(() => erreur);
    })
  );
};
