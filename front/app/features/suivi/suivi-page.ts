import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FestivalService } from '../festivals/festival.service';
import { ApiService } from '../../core/services/api.service';
@Component({standalone:true,imports:[FormsModule],templateUrl:'./suivi-page.html'})
export class SuiviPageComponent {
 private api=inject(ApiService); protected festivals=inject(FestivalService);
 protected lignes=signal<Record<string,unknown>[]>([]); protected erreur=signal(''); protected festivalId:number|null=null;
 constructor(){this.festivals.chargerFestivals().subscribe();}
 charger(){if(!this.festivalId)return;this.api.get<Record<string,unknown>[]>(`/festivals/${this.festivalId}/suivi`).subscribe({next:x=>this.lignes.set(x),error:()=>this.erreur.set('Chargement du suivi impossible.')});}
}
