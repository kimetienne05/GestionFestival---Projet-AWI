import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StructureService } from './structure.service';
import { SessionService } from '../../core/services/session.service';
@Component({standalone:true,imports:[FormsModule],templateUrl:'./structures-page.html'})
export class StructuresPageComponent {
 protected service=inject(StructureService); protected session=inject(SessionService); protected erreur=signal('');
 protected nouveauNom=''; protected estEditeur=false; protected estDistributeur=false; protected estExposant=true; protected estAssociation=false;
 constructor(){this.service.charger().subscribe({error:()=>this.erreur.set('Chargement des structures impossible.')});}
 creer(){this.service.creer({nom:this.nouveauNom,estEditeur:this.estEditeur,estDistributeur:this.estDistributeur,estExposant:this.estExposant,estAssociation:this.estAssociation}).subscribe({next:()=>this.nouveauNom='',error:()=>this.erreur.set('Création impossible.')});}
 supprimer(id:number){if(confirm('Supprimer cette structure ?'))this.service.supprimer(id).subscribe();}
}
