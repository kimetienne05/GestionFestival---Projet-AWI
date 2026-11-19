/**
 * Service de gestion des réservations.
 * Permet de consulter, créer et modifier les réservations,
 * de changer leur statut, de les valider ou de les annuler.
 * Contient également les appels liés aux jeux, aux repas
 * et aux contacts de suivi.
 *
 * TODO :
 * - Compléter les modèles TypeScript des réservations.
 * - Ajouter la gestion des tables par zone tarifaire.
 * - Ajouter la gestion des remises.
 * - Ajouter la gestion des repas.
 * - Ajouter la gestion des jeux et de leur placement.
 * - Compléter la gestion des contacts de suivi.
 * - Vérifier les règles métier avec le back-end.
 */

import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ReponseListe } from '../../core/models/api.types';
export interface Reservation { id:number; festivalId:number; exposantId:number; statut:string; valideeLe?:string|null; exposant?:string; facturable?:boolean; }
@Injectable({providedIn:'root'}) export class ReservationService {
 private api=inject(ApiService); private _reservations=signal<Reservation[]>([]); readonly reservations=this._reservations.asReadonly();
 charger(festivalId?:number){return this.api.get<ReponseListe<Reservation>>('/reservations',festivalId?{festivalId}:undefined).pipe(tap(reponse=>this._reservations.set(reponse.elements)));}
 creer(d:unknown){return this.api.post<Reservation>('/reservations',d).pipe(tap(x=>this._reservations.update(l=>[...l,x])));}
 modifier(id:number,d:unknown){return this.api.put<Reservation>(`/reservations/${id}`,d).pipe(tap(x=>this._reservations.update(l=>l.map(v=>v.id===id?x:v))));}
 changerStatut(id:number,statut:string){return this.api.patch<Reservation>(`/reservations/${id}/statut`,{statut});}
 valider(id:number){return this.api.patch<Reservation>(`/reservations/${id}/validation`);}
 annuler(id:number){return this.api.patch<Reservation>(`/reservations/${id}/annulation`);}
 jeux(id:number){return this.api.get<unknown[]>(`/reservations/${id}/jeux`);}
 enregistrerJeux(id:number,d:unknown){return this.api.put(`/reservations/${id}/jeux`,d);}
 repas(id:number,d:unknown){return this.api.put(`/reservations/${id}/repas`,d);}
 contactsSuivi(id:number){return this.api.get<unknown[]>(`/reservations/${id}/contacts-suivi`);}
 ajouterContactSuivi(id:number,d:unknown){return this.api.post(`/reservations/${id}/contacts-suivi`,d);}
}