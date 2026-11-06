import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
export interface Facture { id:number; numero:string; montantTotal:string; statut:string; reservationId:number; }
@Injectable({providedIn:'root'}) export class FacturationService {
 private api=inject(ApiService); private _factures=signal<Facture[]>([]); readonly factures=this._factures.asReadonly();
 chargerFestival(id:number){return this.api.get<Facture[]>(`/festivals/${id}/factures`).pipe(tap(x=>this._factures.set(x)));}
 chargerReservation(id:number){return this.api.get<Facture[]>(`/reservations/${id}/factures`).pipe(tap(x=>this._factures.set(x)));}
 creer(reservationId:number,d?:unknown){return this.api.post<Facture[]>(`/reservations/${reservationId}/factures`,d);}
 telechargerPdf(id:number){return this.api.telecharger(`/factures/${id}/pdf`);}
 annuler(id:number){return this.api.patch(`/factures/${id}/annulation`);}
 rembourser(id:number){return this.api.patch(`/factures/${id}/remboursement`);}
 paiements(id:number){return this.api.get<unknown[]>(`/factures/${id}/paiements`);}
 ajouterPaiement(id:number,d:unknown){return this.api.post(`/factures/${id}/paiements`,d);}
 refuserPaiement(id:number){return this.api.patch(`/paiements/${id}/refus`);}
}