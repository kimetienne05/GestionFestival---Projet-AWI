---
paths:
  - "db/**"
  - "back/src/depots/**"
  - "**/*.sql"
---

# Base de données (PostgreSQL 18)

Références : DAT section 5, figure 3 (modèle relationnel), annexe H (rôle des tables), annexe I (script SQL initial), ADR-003, ADR-007, ADR-009, ADR-010, ADR-011, ADR-013.

## Migrations

- Le schéma évolue **uniquement** par des migrations numérotées : `db/migrations/NNN_description.sql` (`003_ajout_index_suivi.sql`).
- L'API les applique au démarrage, dans l'ordre, et les note dans `schema_migrations`.
- Migrations **additives** : on ajoute d'abord ; une suppression de colonne se fait dans une version ultérieure (ADR-010), pour que le retour arrière reste possible.
- Ne jamais modifier une migration déjà fusionnée dans `main` : en écrire une nouvelle.

## Nommage

- Tables et colonnes en `snake_case`, au singulier (`reservation`, `zone_tarifaire`).
- Clé primaire `id` ; clé étrangère `<table>_id` ; booléens `est_…` ; horodatages `…_le` (`validee_le`) ; dates calendaires `date_…`.

## Types et contraintes

- Montants en `NUMERIC(10,2)`, jamais en flottant. Horodatages en `TIMESTAMPTZ`, dates calendaires en `DATE`.
- États en `VARCHAR` avec `CHECK`, plutôt qu'un `ENUM`.
- Clés étrangères en `RESTRICT` par défaut ; `CASCADE` seulement pour les données dépendantes (contacts, lignes de réservation).
- Index sur toutes les clés étrangères, sur `reservation(festival_id, statut)` et sur les noms des structures et des jeux.

## Règles du modèle

- Une seule table `structure`, avec `est_editeur`, `est_distributeur`, `est_exposant`, `est_association` (ADR-011). Pas de table « exposant » séparée.
- Une `reservation` par (festival, exposant) ; elle existe dès le premier contact et porte le workflow.
- Statut « considéré absent » calculé à la lecture par la vue `v_reservation_statut` (ADR-009).
- Factures : jamais d'`UPDATE` sur le contenu, jamais de `DELETE` ; lignes figées dans `facture_ligne` ; un déclencheur le garantit. Une correction passe par une annulation puis une nouvelle facture (ADR-003, ADR-007).
- Comptes : `utilisateur.niveau` (1 à 5) et `est_tresorier` (ADR-013). Il n'y a pas de table des rôles.
- Les PDF de règles sont des fichiers du volume `regles` ; la base ne garde que le chemin. Les PDF de factures ne sont pas stockés (ADR-012).
