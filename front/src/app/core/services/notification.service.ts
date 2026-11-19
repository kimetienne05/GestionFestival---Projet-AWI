/**
 * Service centralisant les notifications de l'application.
 * Permet d'afficher un message de succès ou d'erreur temporaire.
 *
 * TODO :
 * - Ajouter le composant graphique chargé d'afficher les notifications.
 * - Permettre éventuellement plusieurs notifications simultanées.
 * - Ajouter des durées d'affichage adaptées au type de notification.
 */

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _message = signal('');
  private readonly _type = signal<'erreur' | 'succes'>('erreur');
  readonly message = this._message.asReadonly();
  readonly type = this._type.asReadonly();

  afficher(message: string, type: 'erreur' | 'succes' = 'erreur'): void {
    this._type.set(type);
    this._message.set(message);
    window.setTimeout(() => this._message.set(''), 5000);
  }
  effacer(): void { this._message.set(''); }
}
