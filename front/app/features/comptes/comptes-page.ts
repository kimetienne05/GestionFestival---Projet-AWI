import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompteService } from './compte.service';
import { NOMS_NIVEAUX } from '../../core/models/api.types';
@Component({standalone:true,imports:[FormsModule],templateUrl:'./comptes-page.html'})
export class ComptesPageComponent {
 protected service=inject(CompteService); protected niveaux=NOMS_NIVEAUX; protected erreur=signal('');
 protected login=''; protected motDePasse=''; protected niveau=1; protected estTresorier=false;
 constructor(){this.service.charger().subscribe({error:()=>this.erreur.set('Chargement des comptes impossible.')});}
 creer(){this.service.creer({login:this.login,motDePasse:this.motDePasse,niveau:this.niveau,estTresorier:this.estTresorier}).subscribe({next:()=>{this.login='';this.motDePasse='';},error:()=>this.erreur.set('Création du compte impossible.')});}
 modifier(id:number,niveau:number,estTresorier:boolean){this.service.modifier(id,{niveau,estTresorier}).subscribe({error:()=>this.erreur.set('Modification impossible.')});}
 desactiver(id:number){if(confirm('Désactiver ce compte ?'))this.service.desactiver(id).subscribe(()=>this.service.charger().subscribe());}
}
