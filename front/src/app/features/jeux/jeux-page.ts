/**
 * Composant de gestion du catalogue des jeux.
 * Charge les jeux et permet leur création, leur suppression
 * ainsi que le dépôt et le téléchargement des règles PDF.
 *
 * TODO :
 * - Ajouter la modification des jeux.
 * - Remplacer la saisie manuelle de l'identifiant éditeur
 *   par une sélection dans les structures existantes.
 * - Ajouter les autres champs du jeu.
 * - Ajouter les filtres et les tris.
 * - Gérer les erreurs de dépôt et de téléchargement.
 */

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JeuService } from './jeux.service';
import { SessionService } from '../../core/services/session.service';
@Component({standalone:true,imports:[FormsModule],templateUrl:'./jeux-page.html'})

export class JeuxPageComponent {
 protected service=inject(JeuService); protected session=inject(SessionService); protected erreur=signal('');
 protected nom=''; 
 protected editeurId=0; 
 protected auteurs=''; 
 protected ageMin:number|null=null; 
 protected joueursMin:number|null=null;
 constructor(){this.service.charger().subscribe({error:()=>this.erreur.set('Chargement du catalogue impossible.')});}
 
 creer(){this.service.creer({nom:this.nom,editeurId:this.editeurId,auteurs:this.auteurs,ageMin:this.ageMin,nbJoueursMin:this.joueursMin,prototype:false}).subscribe({next:()=>this.nom='',error:()=>this.erreur.set('Création impossible. Vérifiez l’identifiant de l’éditeur.')});}
 supprimer(id:number){if(confirm('Supprimer ce jeu ?'))this.service.supprimer(id).subscribe();}
 telecharger(id:number){this.service.telechargerRegles(id).subscribe(blob=>{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`regles-${id}.pdf`;a.click();URL.revokeObjectURL(url);});}
 deposer(id:number,event:Event){const fichier=(event.target as HTMLInputElement).files?.[0];if(fichier)this.service.deposerRegles(id,fichier).subscribe({error:()=>this.erreur.set('Dépôt du PDF impossible.')});}
}
