import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService } from './reservation.service';
import { SessionService } from '../../core/services/session.service';
import { FestivalService } from '../festivals/festival.service';
@Component({standalone:true,imports:[FormsModule],templateUrl:'./reservations-page.html'})
export class ReservationsPageComponent {
 protected service=inject(ReservationService); protected festivals=inject(FestivalService); protected session=inject(SessionService); protected erreur=signal('');
 protected festivalId:number|null=null; protected exposantId:number|null=null;
 constructor(){this.festivals.chargerFestivals().subscribe();this.service.charger().subscribe({error:()=>this.erreur.set('Chargement des réservations impossible.')});}
 filtrer(){this.service.charger(this.festivalId??undefined).subscribe();}
 creer(){if(!this.festivalId||!this.exposantId)return;this.service.creer({festivalId:this.festivalId,exposantId:this.exposantId}).subscribe({next:()=>this.filtrer(),error:()=>this.erreur.set('Création impossible.')});}
 valider(id:number){this.service.valider(id).subscribe({next:()=>this.filtrer(),error:()=>this.erreur.set('Validation impossible.')});}
 annuler(id:number){if(confirm('Annuler cette réservation ?'))this.service.annuler(id).subscribe(()=>this.filtrer());}
}
