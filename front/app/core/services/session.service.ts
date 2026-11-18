/**
 * Gère la session de l'utilisateur connecté à partir du cookie HttpOnly.
 */

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, of, shareReplay, tap, throwError } from 'rxjs';
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

  /**
   * Restaure la session.
   * Une réponse 401 signifie qu'il n'existe pas de session ; une erreur réseau
   * ou serveur est propagée afin de ne pas la confondre avec un visiteur.
   */
  chargerSession(): Observable<Compte | null> {
    if (this._initialisee()) {
      return of(this._compte());
    }

    if (!this.requeteInitialisation) {
      this.requeteInitialisation = this.api.get<Compte>('/auth/moi').pipe(
        tap((compte) => {
          this._compte.set(compte);
          this._initialisee.set(true);
        }),
        catchError((erreur: HttpErrorResponse) => {
          if (erreur.status === 401) {
            this._compte.set(null);
            this._initialisee.set(true);
            return of(null);
          }

          // L'initialisation reste réessayable après une panne réseau ou serveur.
          return throwError(() => erreur);
        }),
        finalize(() => {
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
