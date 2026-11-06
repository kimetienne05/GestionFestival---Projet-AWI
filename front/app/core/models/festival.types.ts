export interface Festival {
  id: number;
  nom: string;
  lieu: string;
  dateDebut: string;
  dateFin: string;
  surfaceTotaleM2: number;
  tailleTableM2: number;
  prixRepas: string;
  tablesDisponibles?: number;
  capaciteTotale?: number;
}
export interface ZoneTarifaire {
  id: number;
  festivalId?: number;
  nom: string;
  capacite: number;
  prixTable: string;
  remisePrecommande?: string | null;
  dateLimite?: string | null;
  tablesRestantes?: number;
}
export interface ZonePlan {
  id: number;
  nom: string;
  nbTables: number;
  zoneTarifaireId: number;
}
export interface FestivalCreation {
  nom: string;
  lieu: string;
  dateDebut: string;
  dateFin: string;
  surfaceTotaleM2: number;
  tailleTableM2: number;
  prixRepas: string;
  copieDe?: number;
}
