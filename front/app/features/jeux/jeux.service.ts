import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
export interface Jeu { id:number; nom:string; auteurs?:string; editeurId:number; distributeurId?:number|null; typeJeuId?:number|null; ageMin?:number|null; ageMax?:number|null; nbJoueursMin?:number|null; nbJoueursMax?:number|null; dureeMin?:number|null; prototype:boolean; reglesPdf?:string|null; }
@Injectable({providedIn:'root'}) export class JeuService {
 private api=inject(ApiService); private _jeux=signal<Jeu[]>([]); readonly jeux=this._jeux.asReadonly();
 charger(filtres?:Record<string,string|number>){return this.api.get<Jeu[]|{elements:Jeu[]}>('/jeux',filtres).pipe(tap(r=>this._jeux.set(Array.isArray(r)?r:r.elements)));}
 creer(d:Partial<Jeu>){return this.api.post<Jeu>('/jeux',d).pipe(tap(x=>this._jeux.update(l=>[...l,x])));}
 modifier(id:number,d:Partial<Jeu>){return this.api.put<Jeu>(`/jeux/${id}`,d).pipe(tap(x=>this._jeux.update(l=>l.map(v=>v.id===id?x:v))));}
 supprimer(id:number){return this.api.delete<void>(`/jeux/${id}`).pipe(tap(()=>this._jeux.update(l=>l.filter(x=>x.id!==id))));}
 types(){return this.api.get<unknown[]>('/types-jeu');}
 telechargerRegles(id:number){return this.api.telecharger(`/jeux/${id}/regles`);}
 deposerRegles(id:number,fichier:File){return this.api.envoyerFichier(`/jeux/${id}/regles`,fichier);}
}