# Conventions du projet

Ce fichier fixe les règles de nommage, de branches, de commit et de revue. Il s'applique à toute l'équipe **et à l'assistant IA** : `CLAUDE.md` (à la racine) et les règles de `.claude/rules/` en reprennent l'essentiel, et les commandes `/commit` et `/revue` s'appuient sur lui (section 6).

## 1. Nommage dans le code

| Élément | Règle | Exemple |
|---|---|---|
| Fichiers et dossiers | kebab-case | `reservation.service.ts`, `carte-festival/` |
| Classes, interfaces, types | PascalCase | `ReservationService`, `ReservationPublique` |
| Variables, fonctions, méthodes | camelCase, verbe pour une fonction | `calculerPrix()`, `tablesRestantes` |
| Constantes globales | MAJUSCULES_AVEC_SOULIGNÉS | `DUREE_JETON_HEURES` |
| Signaux Angular | nom du contenu, sans suffixe | `festivalCourant`, `reservations` |
| Booléens | préfixe `est`, `a` ou `peut` | `estValidee`, `peutModifier` |
| Langue des identifiants | français, sans accents | `exposant`, `zoneTarifaire` |

### Back-end (couches, ADR-005)

Un fichier par ressource et par couche, nommé `<ressource>.<couche>.ts` :

```
back/src/routes/reservation.routes.ts
back/src/controleurs/reservation.controleur.ts
back/src/services/reservation.service.ts
back/src/depots/reservation.depot.ts
back/src/types/reservation.types.ts
```

- Fonctions de dépôt : un verbe et ce qu'elles renvoient (`trouverParId`, `listerParFestival`, `creer`, `verrouillerZones`).
- Erreurs métier : classes `Erreur<Nature>` (`ErreurConflit`, `ErreurDroits`, `ErreurIntrouvable`).

### Base de données

- Tables et colonnes en `snake_case`, au singulier : `reservation`, `zone_tarifaire`.
- Clé primaire `id` ; clé étrangère `<table>_id` (`festival_id`) ; booléens `est_…` (`est_tresorier`).
- Horodatages `…_le` (`validee_le`, `cree_le`) ; dates calendaires `date_…` (`date_paiement`).
- Migrations : `db/migrations/NNN_description.sql` (`003_ajout_index_suivi.sql`).

### API

- Préfixe `/api/v1` ; ressources au pluriel, en français et en kebab-case (`/zones-tarifaires`).
- Actions métier en `PATCH` sur une sous-ressource (`/reservations/:id/validation`).
- JSON en camelCase ; codes d'erreur en MAJUSCULES (`CAPACITE_DEPASSEE`).

### Front-end

- Un dossier par fonctionnalité dans `front/src/app/features/` ; `core/` et `shared/` comme décrit dans le DAT.
- Composants standalone, signaux, `inject()`, `@if` / `@for` uniquement.

## 2. Branches

Chaque branche est créée depuis son issue, avec le bouton **« Create branch »** de GitLab (dans l'issue, menu de « Create merge request »), en partant de `develop`. GitLab la nomme `numero-titre-de-l-issue`, en kebab-case : on garde ce nom.

```
10-dockerize-the-project
13-set-up-the-frontend-skeleton
```

Sans bouton GitLab (branche créée à la main), on suit le même format : `numero-issue-description-courte`, en anglais. Les branches déjà créées au format `type/numero-…` (`docs/77-instructions-ia`) restent valables.

On ne travaille jamais directement sur `main` ni sur `develop` : chaque branche part de `develop` et y revient par une merge request.

## 3. Messages de commit

Format (inspiré de *Conventional Commits*) :

```
type(scope): imperative description, lowercase, no final period

Optional body: why this change, what it implies.

Refs #12
```

- **Langue** : le message est **en anglais** (première ligne et corps). Les commits déjà faits en français restent tels quels.
- **Première ligne** : 72 caractères au plus, à l'impératif (« add », « fix », pas « added » ni « adds »).
- **Types** :

| Type | Usage |
|---|---|
| `feat` | nouvelle fonctionnalité |
| `fix` | correction de bogue |
| `docs` | documentation (DAT, ADR, besoin, README) |
| `test` | ajout ou correction de tests |
| `refactor` | réorganisation du code sans changement de comportement |
| `style` | mise en forme, sans effet sur le code |
| `perf` | amélioration des performances |
| `build` | dépendances, Dockerfile, `docker-compose` |
| `ci` | pipeline GitLab |
| `chore` | tâches diverses |

- **Portées** : `front`, `api`, `db`, `ci`, `docker`, `docs`, ou une fonctionnalité (`reservations`, `factures`, `festivals`, `structures`, `jeux`, `suivi`, `auth`, `comptes`).
- **Dernière ligne** : le numéro d'issue, avec `Refs #12`, ou `Closes #12` si le commit termine l'issue. Seules des lignes d'attribution (`Co-Authored-By: …`) peuvent la suivre.
- Changement qui casse la compatibilité (route, schéma) : `!` après le type, par exemple `feat(api)!: …`, et le détail dans le corps.

Exemples :

```
feat(reservations): compute the price with the pre-order discount
fix(api): return 409 when the zone capacity is exceeded
docs(dat): add http status codes to the endpoint list
test(factures): check that an issued invoice cannot be modified
```

Le format est vérifié par le crochet `.githooks/commit-msg` (installation en section 5) : un message non conforme est refusé, avec l'explication. Les messages produits par git lui-même (`Merge …`, `Revert …`) sont acceptés.

## 4. Merge requests et revues

- Une merge request par issue. Son titre suit le même format qu'un message de commit.
- Titres et descriptions des merge requests et des issues, et commentaires de revue : **en anglais**.
- Elle est **relue et approuvée par un autre membre que son auteur** avant d'être fusionnée. Le pipeline doit être vert.
- Le modèle `.gitlab/merge_request_templates/Default.md` pré-remplit la description de chaque merge request avec la liste de vérification de la revue (choisir le modèle « Default » s'il n'est pas proposé d'office).
- La personne qui relit vérifie au minimum :
  - le respect du DAT et des ADR (couches, SQL dans les dépôts, droits dans l'API) ;
  - les requêtes SQL paramétrées ;
  - l'absence de secret dans le code ;
  - la présence de tests pour le nouveau comportement ;
  - les noms, qui suivent ce fichier ;
  - la mise à jour du DAT si l'architecture change.
- Les remarques se font dans GitLab, sur la ligne concernée. L'auteur répond à chaque remarque ou la corrige avant la fusion.
- Une contribution importante de l'IA est signalée dans la description de la merge request.

## 5. Installer les outils (une fois par poste)

À lancer à la racine du dépôt, après le clonage :

```bash
git config core.hooksPath .githooks     # active la vérification des messages de commit
git config commit.template .gitmessage  # affiche le modèle dans l'éditeur au moment du commit
```

Pour vérifier : `git commit --allow-empty -m "essai"` doit être refusé avec une explication.

## 6. Assistant IA (Claude Code)

| Fichier | Rôle |
|---|---|
| `CLAUDE.md` (racine) | consignes générales, chargées à chaque session |
| `.claude/rules/*.md` | règles par partie du dépôt (`back`, `front`, `db`, `deploiement`, `docs`), chargées seulement quand l'assistant travaille sur les fichiers concernés |
| `.claude/commands/commit.md` | commande `/commit` : propose un message conforme à partir des changements indexés, puis attend la confirmation avant de commiter |
| `.claude/commands/revue.md` | commande `/revue` : relit la branche avec la liste de vérification de la section 4, sans rien modifier |

- Ces fichiers sont versionnés et suivent le circuit normal des merge requests : on les modifie comme du code.
- Une règle qui change ici doit aussi changer dans `CLAUDE.md` ou `.claude/rules/`, et inversement.
- Préférences personnelles : `CLAUDE.local.md` et `.claude/settings.local.json`, ignorés par git.
