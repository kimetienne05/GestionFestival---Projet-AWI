/**
 * Service de gestion des structures.
 * Permet de récupérer, créer, modifier et supprimer des structures.
 * Propose également des méthodes de consultation et d'ajout des contacts.
 *
 * TODO :
 * - Ajouter la modification et la suppression des contacts.
 * - Compléter les méthodes de gestion des contacts.
 * - Vérifier les formats des données avec les schémas Zod.
 * - Ajouter les filtres et paramètres de recherche.
 */

import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ReponseListe } from '../../core/models/api.types';
export interface Structure { id:number; nom:string; estEditeur:boolean; estDistributeur:boolean; estExposant:boolean; estAssociation:boolean; clienteDouteuse?:boolean; }
@Injectable({providedIn:'root'}) export class StructureService {
 private api=inject(ApiService); private _structures=signal<Structure[]>([]); readonly structures=this._structures.asReadonly();
 charger(){return this.api.get<ReponseListe<Structure>>('/structures').pipe(tap(r=>this._structures.set(Array.isArray(r)?r:r.elements)));}
 creer(d:Partial<Structure>){return this.api.post<Structure>('/structures',d).pipe(tap(x=>this._structures.update(l=>[...l,x])));}
 modifier(id:number,d:Partial<Structure>){return this.api.put<Structure>(`/structures/${id}`,d).pipe(tap(x=>this._structures.update(l=>l.map(v=>v.id===id?x:v))));}
 supprimer(id:number){return this.api.delete<void>(`/structures/${id}`).pipe(tap(()=>this._structures.update(l=>l.filter(x=>x.id!==id))));}
 contacts(id:number){return this.api.get<unknown[]>(`/structures/${id}/contacts`);}
 ajouterContact(id:number,d:unknown){return this.api.post(`/structures/${id}/contacts`,d);}
}