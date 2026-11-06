import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { SessionService } from '../services/session.service';

export const gestionErreursInterceptor: HttpInterceptorFn = (requete, suivant) => {
  const routeur = inject(Router);
  const notifications = inject(NotificationService);
  const session = inject(SessionService);

  return suivant(requete).pipe(catchError((erreur: HttpErrorResponse) => {
    if (erreur.status === 401 && !requete.url.endsWith('/auth/connexion')) {
      session.viderSession();
      if (!routeur.url.startsWith('/connexion')) routeur.navigate(['/connexion']);
    } else if (erreur.status === 403) {
      notifications.afficher('Vous ne disposez pas des droits nécessaires.');
    } else if (erreur.status === 409) {
      const message = erreur.error?.message ?? 'Cette action est incompatible avec l’état actuel des données.';
      notifications.afficher(message);
    } else if (erreur.status >= 500) {
      notifications.afficher('Le serveur rencontre un problème. Réessayez plus tard.');
    }
    return throwError(() => erreur);
  }));
};
