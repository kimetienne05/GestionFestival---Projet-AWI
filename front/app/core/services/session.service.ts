/**
 * Gère la session de l'utilisateur connecté.
 * Permet de récupérer le profil, de se connecter et de se déconnecter.
 * Le compte courant est conservé dans un signal Angular.
 *
 * TODO :
 * - Tester la restauration de session après rechargement de la page.
 * - Vérifier la gestion du cookie HttpOnly avec le back-end.
 * - Ajouter le changement de mot de passe.
 * - Vérifier les différents cas d'expiration de session.
 */

import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, of, shareReplay, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Compte } from '../models/api.types';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly api = inject(ApiService);
  private readonly routeur = inject(Router);
  private readonly _compte = signal<Compte | null>(null);
  private readonly _initialisee = signal(false);
  private requeteInitialisation: Observable<Compte | null> | null = null;

  readonly compte = this._compte.asReadonly();
  readonly initialisee = this._initialisee.asReadonly();
  readonly estConnecte = computed(() => this._compte() !== null);

  /** Charge le profil une seule fois ; le cookie HttpOnly est envoyé par le navigateur. */
  chargerSession(): Observable<Compte | null> {
    if (this._initialisee()) return of(this._compte());
    if (!this.requeteInitialisation) {
      this.requeteInitialisation = this.api.get<Compte>('/auth/moi').pipe(
        tap((compte) => this._compte.set(compte)),
        catchError(() => {
          this._compte.set(null);
          return of(null);
        }),
        finalize(() => {
          this._initialisee.set(true);
          this.requeteInitialisation = null;
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.requeteInitialisation;
  }

  connecter(login: string, motDePasse: string): Observable<Compte> {
    return this.api.post<Compte>('/auth/connexion', { login, motDePasse });
  }

  definirCompte(compte: Compte): void {
    this._compte.set(compte);
    this._initialisee.set(true);
  }

  deconnecter(): void {
    this.api.post<void>('/auth/deconnexion').pipe(
      finalize(() => {
        this._compte.set(null);
        this._initialisee.set(true);
        void this.routeur.navigateByUrl('/festivals');
      })
    ).subscribe({ error: () => this._compte.set(null) });
  }

  viderSession(): void {
    this._compte.set(null);
    this._initialisee.set(true);
  }
}
