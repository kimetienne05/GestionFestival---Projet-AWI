/**
 * Définit les interfaces TypeScript liées aux festivals.
 * Contient les modèles Festival, ZoneTarifaire, ZonePlan
 * et les données nécessaires à la création d'un festival.
 *
 * TODO :
 * - Vérifier la correspondance avec les schémas Zod du back-end.
 * - Compléter les types si nécessaire pour les zones tarifaires et le plan.
 * - Ajouter les types des éventuelles données de copie d'un festival.
 */

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
