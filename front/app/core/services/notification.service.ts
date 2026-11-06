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
