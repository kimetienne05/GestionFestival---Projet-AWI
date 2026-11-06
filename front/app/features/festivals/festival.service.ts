import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Festival, FestivalCreation, ZonePlan, ZoneTarifaire } from '../../core/models/festival.types';

@Injectable({ providedIn: 'root' })
export class FestivalService {
  private readonly api = inject(ApiService);
  private readonly _festivals = signal<Festival[]>([]);
  private readonly _festivalCourant = signal<Festival | null>(null);
  private readonly _zonesTarifaires = signal<ZoneTarifaire[]>([]);
  private readonly _zonesPlan = signal<ZonePlan[]>([]);
  readonly festivals = this._festivals.asReadonly();
  readonly festivalCourant = this._festivalCourant.asReadonly();
  readonly zonesTarifaires = this._zonesTarifaires.asReadonly();
  readonly zonesPlan = this._zonesPlan.asReadonly();
  readonly nombreFestivals = computed(() => this._festivals().length);

  chargerFestivals() {
    return this.api.get<Festival[] | { elements: Festival[]; total: number }>('/festivals').pipe(
      tap((reponse) => this._festivals.set(Array.isArray(reponse) ? reponse : reponse.elements))
    );
  }
  chargerFestival(id: number) {
    return this.api.get<Festival>(`/festivals/${id}`).pipe(tap((festival) => this._festivalCourant.set(festival)));
  }
  creer(donnees: FestivalCreation) {
    return this.api.post<Festival>('/festivals', donnees).pipe(tap((festival) => this._festivals.update((liste) => [...liste, festival])));
  }
  modifier(id: number, donnees: Partial<FestivalCreation>) {
    return this.api.put<Festival>(`/festivals/${id}`, donnees).pipe(tap((festival) => {
      this._festivalCourant.set(festival);
      this._festivals.update((liste) => liste.map((item) => item.id === id ? festival : item));
    }));
  }
  supprimer(id: number) {
    return this.api.delete<void>(`/festivals/${id}`).pipe(tap(() => this._festivals.update((liste) => liste.filter((item) => item.id !== id))));
  }
  chargerZonesTarifaires(id: number) {
    return this.api.get<ZoneTarifaire[]>(`/festivals/${id}/zones-tarifaires`).pipe(tap((zones) => this._zonesTarifaires.set(zones)));
  }
  creerZoneTarifaire(id: number, donnees: Partial<ZoneTarifaire>) {
    return this.api.post<ZoneTarifaire>(`/festivals/${id}/zones-tarifaires`, donnees).pipe(tap((zone) => this._zonesTarifaires.update((liste) => [...liste, zone])));
  }
  modifierZoneTarifaire(id: number, zoneId: number, donnees: Partial<ZoneTarifaire>) {
    return this.api.put<ZoneTarifaire>(`/festivals/${id}/zones-tarifaires/${zoneId}`, donnees).pipe(tap((zone) => this._zonesTarifaires.update((liste) => liste.map((item) => item.id === zoneId ? zone : item))));
  }
  supprimerZoneTarifaire(id: number, zoneId: number) {
    return this.api.delete<void>(`/festivals/${id}/zones-tarifaires/${zoneId}`).pipe(tap(() => this._zonesTarifaires.update((liste) => liste.filter((item) => item.id !== zoneId))));
  }
  chargerZonesPlan(id: number) {
    return this.api.get<ZonePlan[]>(`/festivals/${id}/zones-plan`).pipe(tap((zones) => this._zonesPlan.set(zones)));
  }
  creerZonePlan(id: number, donnees: Partial<ZonePlan>) {
    return this.api.post<ZonePlan>(`/festivals/${id}/zones-plan`, donnees).pipe(tap((zone) => this._zonesPlan.update((liste) => [...liste, zone])));
  }
}
