/**
 * Composant de consultation et de gestion des factures.
 * Permet de sélectionner un festival, d'afficher ses factures,
 * d'en créer, de télécharger les PDF, d'annuler et de rembourser.
 *
 * TODO :
 * - Ajouter l'affichage des paiements associés à chaque facture.
 * - Ajouter le formulaire d'enregistrement d'un paiement.
 * - Ajouter le choix du moyen de paiement.
 * - Ajouter la gestion des chèques refusés.
 * - Afficher le reste à payer.
 * - Ajouter les contrôles de droits sur chaque action.
 */

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FacturationService } from './facturation.service';
import { SessionService } from '../../core/services/session.service';
import { FestivalService } from '../festivals/festival.service';
@Component({standalone:true,imports:[FormsModule],templateUrl:'./facturation-page.html'})
export class FacturationPageComponent {
 protected service=inject(FacturationService); protected session=inject(SessionService); protected festivals=inject(FestivalService);
 protected festivalId:number|null=null; protected reservationId:number|null=null; protected erreur=signal('');
 constructor(){this.festivals.chargerFestivals().subscribe();}
 charger(){if(!this.festivalId)return;this.service.chargerFestival(this.festivalId).subscribe({error:()=>this.erreur.set('Chargement des factures impossible.')});}
 creer(){if(!this.reservationId)return;this.service.creer(this.reservationId).subscribe({next:()=>this.charger(),error:()=>this.erreur.set('Création de facture impossible.')});}
 pdf(id:number){this.service.telechargerPdf(id).subscribe(blob=>{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`facture-${id}.pdf`;a.click();URL.revokeObjectURL(url);});}
 annuler(id:number){if(confirm('Annuler cette facture ?'))this.service.annuler(id).subscribe(()=>this.charger());}
 rembourser(id:number){this.service.rembourser(id).subscribe(()=>this.charger());}
}
