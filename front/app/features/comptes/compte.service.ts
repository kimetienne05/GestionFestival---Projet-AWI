/**
 * Service d'administration des comptes utilisateurs.
 * Permet de consulter, créer, modifier, désactiver
 * et supprimer des comptes via l'API.
 *
 * TODO :
 * - Compléter la gestion de la suppression des comptes.
 * - Ajouter les contrôles nécessaires avant les opérations.
 * - Ajouter la gestion du changement de mot de passe.
 * - Vérifier la protection du dernier administrateur.
 */

import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Compte } from '../../core/models/api.types';
@Injectable({providedIn:'root'}) export class CompteService {
 private api=inject(ApiService); private _comptes=signal<Compte[]>([]); readonly comptes=this._comptes.asReadonly();
 charger(){return this.api.get<Compte[]|{elements:Compte[]}>('/utilisateurs').pipe(tap(r=>this._comptes.set(Array.isArray(r)?r:r.elements)));}
 creer(d:Partial<Compte>&{motDePasse?:string}){return this.api.post<Compte>('/utilisateurs',d).pipe(tap(x=>this._comptes.update(l=>[...l,x])));}
 modifier(id:number,d:Partial<Compte>){return this.api.put<Compte>(`/utilisateurs/${id}`,d).pipe(tap(x=>this._comptes.update(l=>l.map(v=>v.id===id?x:v))));}
 desactiver(id:number){return this.api.patch(`/utilisateurs/${id}/desactivation`);}
 supprimer(id:number){return this.api.delete<void>(`/utilisateurs/${id}`).pipe(tap(()=>this._comptes.update(l=>l.filter(x=>x.id!==id))));}
}