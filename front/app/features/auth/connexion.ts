import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { Compte } from '../../core/models/api.types';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './connexion.html'
})
export class ConnexionComponent {
  private readonly session = inject(SessionService);
  private readonly routeur = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected login = '';
  protected motDePasse = '';
  protected readonly chargement = signal(false);
  protected readonly erreur = signal('');
  connecter(): void {
    this.chargement.set(true);
    this.erreur.set('');
    this.session.connecter(this.login, this.motDePasse).subscribe({
      next: (compte) => {
        this.session.definirCompte(compte as Compte);
        const retour = this.route.snapshot.queryParamMap.get('retour') ?? '/festivals';
        void this.routeur.navigateByUrl(retour);
      },
      error: () => { this.erreur.set('Identifiant ou mot de passe incorrect.'); this.chargement.set(false); }
    });
  }
}
