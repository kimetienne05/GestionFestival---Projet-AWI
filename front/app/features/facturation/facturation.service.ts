/**
 * Service de gestion de la facturation.
 * Permet de consulter les factures d'un festival ou d'une réservation,
 * de créer une facture, de télécharger son PDF, de l'annuler
 * et de gérer les remboursements et les paiements.
 *
 * TODO :
 * - Ajouter la mise à jour de l'état local après chaque opération.
 * - Compléter la gestion des paiements.
 * - Ajouter la gestion des paiements refusés.
 * - Vérifier les statuts des factures et remboursements.
 * - Ajouter les types détaillés des paiements.
 * - Vérifier les contrats API avec le back-end.
 */

import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ReponseListe } from '../../core/models/api.types';
export interface Facture { id:number; numero:string; montantTotal:string; statut:string; reservationId:number; }
@Injectable({providedIn:'root'}) export class FacturationService {
 private api=inject(ApiService); private _factures=signal<Facture[]>([]); readonly factures=this._factures.asReadonly();
 chargerFestival(id:number){return this.api
  .get<ReponseListe<Facture>>(`/festivals/${id}/factures`)
  .pipe(tap(reponse => this._factures.set(reponse.elements)));}

 chargerReservation(id:number){return this.api
  .get<ReponseListe<Facture>>(`/reservations/${id}/factures`)
  .pipe(tap(reponse => this._factures.set(reponse.elements)));}

 creer(reservationId:number,d?:unknown){
    return this.api.post<Facture>(`/reservations/${reservationId}/factures`,d);
}

 telechargerPdf(id:number){return this.api.telecharger(`/factures/${id}/pdf`);}

 annuler(id:number){return this.api.patch(`/factures/${id}/annulation`);}

 rembourser(id:number){return this.api.patch(`/factures/${id}/remboursement`);}

 paiements(id:number){return this.api.get<unknown[]>(`/factures/${id}/paiements`);}

 ajouterPaiement(id:number,d:unknown){return this.api.post(`/factures/${id}/paiements`,d);}

 refuserPaiement(id:number){return this.api.patch(`/paiements/${id}/refus`);}
}