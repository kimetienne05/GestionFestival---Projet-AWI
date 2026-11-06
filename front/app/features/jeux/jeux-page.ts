import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JeuService } from './jeux.service';
import { SessionService } from '../../core/services/session.service';
@Component({standalone:true,imports:[FormsModule],templateUrl:'./jeux-page.html'})
export class JeuxPageComponent {
 protected service=inject(JeuService); protected session=inject(SessionService); protected erreur=signal('');
 protected nom=''; protected editeurId=0; protected auteurs=''; protected ageMin:number|null=null; protected joueursMin:number|null=null;
 constructor(){this.service.charger().subscribe({error:()=>this.erreur.set('Chargement du catalogue impossible.')});}
 creer(){this.service.creer({nom:this.nom,editeurId:this.editeurId,auteurs:this.auteurs,ageMin:this.ageMin,nbJoueursMin:this.joueursMin,prototype:false}).subscribe({next:()=>this.nom='',error:()=>this.erreur.set('Création impossible. Vérifiez l’identifiant de l’éditeur.')});}
 supprimer(id:number){if(confirm('Supprimer ce jeu ?'))this.service.supprimer(id).subscribe();}
 telecharger(id:number){this.service.telechargerRegles(id).subscribe(blob=>{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`regles-${id}.pdf`;a.click();URL.revokeObjectURL(url);});}
 deposer(id:number,event:Event){const fichier=(event.target as HTMLInputElement).files?.[0];if(fichier)this.service.deposerRegles(id,fichier).subscribe({error:()=>this.erreur.set('Dépôt du PDF impossible.')});}
}
