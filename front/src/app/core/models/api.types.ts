export interface ReponseListe<T> {
  elements: T[];
  total: number;
}
export interface ErreurApi {
  code?: string;
  message?: string;
  details?: unknown;
}
export interface Compte {
  id: number;
  login: string;
  niveau: number;
  tresorier: boolean;
  actif?: boolean;
}
export const NOMS_NIVEAUX: Record<number, string> = {
  1: 'Membre de l’organisation',
  2: 'Gestionnaire de jeux',
  3: 'Gestionnaire de plan',
  4: 'Commercial',
  5: 'Administrateur'
};
