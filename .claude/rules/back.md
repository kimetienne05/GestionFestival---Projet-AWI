---
paths:
  - "back/**"
---

# Back-end (API Node.js, Express, TypeScript)

Références : DAT section 4.2 et 4.3, annexe C (droits), annexe G (endpoints), ADR-002, ADR-005, ADR-006, ADR-008, ADR-009.

## Couches (ADR-005)

Chaque couche n'appelle que celle du dessous. Un fichier par ressource et par couche : `<ressource>.<couche>.ts`.

| Couche | Dossier | Rôle | Interdit |
|---|---|---|---|
| Routes | `back/src/routes` | URL, méthode, intergiciels de droits (`exigerNiveau(n)`, `exigerRole('tresorier')`) | logique métier, SQL |
| Contrôleurs | `back/src/controleurs` | lire la requête, la valider avec `zod`, appeler le service, choisir le code HTTP | SQL, règles métier |
| Services | `back/src/services` | règles métier (prix, remises, capacité, workflow, masquage) | `req`, `res`, tout ce qui touche à HTTP, SQL |
| Dépôts | `back/src/depots` | **seul** endroit qui contient du SQL | règles métier |

Types partagés : `back/src/types/<ressource>.types.ts`. Erreurs métier : classes `Erreur<Nature>` (`ErreurConflit`, `ErreurDroits`, `ErreurIntrouvable`), traduites en JSON par un intergiciel unique.

## SQL

- **Toujours** des requêtes paramétrées (`$1`, `$2`…). **Jamais** de concaténation ni de gabarit de chaîne avec une valeur reçue.
- Une fonction par requête, au nom explicite : un verbe et ce qu'elle renvoie (`trouverReservationParId`, `listerParFestival`, `verrouillerZones`).
- Écriture dans plusieurs tables : `avecTransaction(async (client) => …)`, et chaque dépôt reçoit le `client` en paramètre.
- Création ou modification d'une réservation : verrouiller le festival puis les zones avec `SELECT … FOR UPDATE`, dans l'ordre croissant des identifiants (ADR-008), puis recalculer les tables restantes.
- Le statut d'une réservation se lit **toujours** dans la vue `v_reservation_statut` (ADR-009).

## Conventions de l'API (DAT 4.3)

- Préfixe `/api/v1` ; ressources au pluriel, en français et en kebab-case (`/zones-tarifaires`).
- Actions métier en `PATCH` sur une sous-ressource (`/reservations/:id/validation`).
- JSON en camelCase ; dates en ISO 8601 ; montants en chaîne décimale (`"125.50"`).
- Pagination : `?page=1&taille=25&tri=nom&ordre=asc`, réponse `{ "elements": [...], "total": 312 }`.
- Erreurs : `{ "code": "CAPACITE_DEPASSEE", "message": "…", "details": {…} }` ; codes en MAJUSCULES.
- Codes : 400 (données invalides), 401 (non connecté), 403 (droits insuffisants), 404 (introuvable), 409 (conflit, dont une suppression refusée parce que des données y font référence), 413 (PDF trop gros), 429 (trop d'essais), 503 (base injoignable).
- `GET /api/v1/sante` répond 200, ou 503 si la base ne répond pas : le healthcheck Docker et le job de déploiement en dépendent.
- Toute nouvelle route doit figurer dans l'annexe G du DAT : **le signaler** si elle n'y est pas.

## Sécurité (DAT section 6)

- Les droits sont **toujours** vérifiés dans l'API, selon la matrice de l'annexe C.
- Données commerciales masquées par **liste blanche** (ADR-002) : construire la réponse publique en recopiant seulement les champs autorisés, jamais en supprimant des champs d'un objet complet.
- Mots de passe hachés avec `bcrypt` (coût 12). Même message 401 pour un login inconnu et un mauvais mot de passe.
- JWT (8 h) dans un cookie `HttpOnly; Secure; SameSite=Strict`, jamais dans le corps ni dans `localStorage` (ADR-006).
- `helmet` ; au plus 10 essais de connexion par minute et par IP ; PDF de règles limités en taille et en type, enregistrés sous un nom généré (jamais le nom envoyé).
- Une erreur 500 est journalisée côté serveur sans aucun détail interne dans la réponse (ni pile, ni SQL).
- Secrets lus dans les variables d'environnement (`DB_PASSWORD`, `JWT_SECRET`…), jamais écrits dans le code.

## Tests

- Tout code de service ou de route s'accompagne de tests : `docker compose run --rm api npm test`.
- Tests à ne jamais supprimer ni affaiblir : matrice des droits rôle × route ; non-fuite des informations commerciales ; capacité en accès concurrents ; immuabilité des factures.
- Le code passe `npm run lint` et `tsc --noEmit` sans erreur.
