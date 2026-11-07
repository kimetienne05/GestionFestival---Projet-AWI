# CLAUDE.md : consignes pour l'assistant de codage

Ce fichier est chargé à chaque session de Claude Code. Il est versionné, comme l'exige l'énoncé.
Les règles propres à une partie du dépôt sont dans `.claude/rules/` : elles se chargent seules quand on travaille dans les fichiers concernés (voir la section 7).

**Règle principale : l'IA exécute, l'équipe décide.** Les choix d'architecture sont pris par l'équipe et consignés dans le DAT et ses ADR. L'assistant les applique ; il ne les change pas de lui-même.

## 1. Le projet

Application de gestion d'un festival de jeux de société pour une association (groupe 11, Polytech Montpellier) :
- suivi des exposants (CRM), festival par festival ;
- réservations de tables par zone tarifaire, avec prix et remises ;
- placement des jeux sur le plan ;
- facturation PDF et suivi des paiements.

Rôles : administrateur (5), commercial (4), gestionnaire de plan (3), gestionnaire de jeux (2), membre (1), trésorier en indicateur parallèle, visiteur sans compte (ADR-001, ADR-013).

## 2. Documents de référence (`docs/`)

| Fichier | Contenu | Quand le lire |
|---|---|---|
| `docs/besoins.pdf` | besoin du client, réponses Q1 à Q26 ; il fait référence en cas de doute fonctionnel | règle métier, cas d'utilisation |
| `docs/dat.pdf` | architecture : sections 4 à 8, modèle de données (fig. 3), droits (annexe C), endpoints (annexe G), SQL initial (annexe I) | avant toute tâche |
| `docs/adr.pdf` | les 13 décisions d'architecture, avec leurs options | dès qu'une tâche touche une décision |

Avant d'écrire du code, lire la partie du DAT et les ADR qui concernent la tâche (`pdftotext -layout docs/dat.pdf -` pour chercher dedans).
En cas de contradiction entre une demande et le DAT, **le signaler** au lieu de choisir seul.

## 3. Contraintes imposées (non négociables)

- **Front-end** : Angular ≥ 22 en syntaxe moderne (standalone, signaux, `inject()`, `@if` / `@for`).
- **Back-end** : Node.js 24 et TypeScript strict, Express 5. Pas de framework applicatif (ni NestJS, ni AdonisJS).
- **Base** : PostgreSQL 18 avec le pilote `pg`. **Pas d'ORM ni de query builder** (ni Prisma, TypeORM, Sequelize, Knex) : SQL écrit à la main.
- **Environnement** : tout se lance avec `docker compose up`, sans rien installer d'autre que Docker.
- **Déploiement** : pipeline GitLab CI/CD vers la VM du groupe (Docker rootless).

## 4. Organisation du dépôt

```
back/          API Node.js (routes → contrôleurs → services → dépôts, ADR-005)
front/         application Angular
db/            image PostgreSQL et migrations numérotées (db/migrations/)
docs/          DAT, ADR, besoin (PDF)
CONTRIBUTING.md  nommage, branches, commits, revues
.claude/       consignes et commandes de l'assistant (rules/, commands/)
.githooks/     crochet qui vérifie les messages de commit
.gitlab/       modèle de merge request
```

## 5. Commandes

```bash
cp .env.example .env                    # une fois
docker compose up --build               # lance base, API (3000) et front (4200)
docker compose run --rm api npm test    # tests de l'API
docker compose run --rm api npm run lint
docker compose logs -f api              # journaux
docker compose down                     # arrêt (-v efface aussi la base)
```

Ne jamais proposer `npm install` sur le poste : les dépendances s'installent dans les conteneurs.

## 6. Git et conventions

Le détail est dans `CONTRIBUTING.md`. L'essentiel :
- branche créée depuis l'issue avec le bouton « Create branch » de GitLab, qui la nomme `numero-titre-de-l-issue` (`13-set-up-the-frontend-skeleton`) ; jamais de travail direct sur `main` ni sur `develop` ;
- commit **en anglais** : `type(scope): description à l'impératif, en minuscules` (`fix(api): return 409 when the zone is full`) puis, en dernière ligne, `Refs #n` ou `Closes #n` ;
- titres et descriptions des merge requests et des issues **en anglais** ;
- pour commiter, utiliser `/commit` : proposer le message, puis **attendre la confirmation** avant `git commit` ;
- une merge request par issue, relue par un autre membre ; `/revue` applique la liste de vérification ;
- si un message ou un nom écrit par l'équipe ne respecte pas les conventions, **proposer la correction** ;
- ne jamais créer ni pousser de tag `dat-v*` : c'est une décision de l'équipe.

## 7. Règles par partie du dépôt (`.claude/rules/`)

| Fichier | Se charge pour | Contenu |
|---|---|---|
| `back.md` | `back/**` | couches, SQL, conventions de l'API, sécurité, tests |
| `front.md` | `front/**` | Angular moderne, état, appels à l'API |
| `db.md` | `db/**`, dépôts SQL | migrations, types, factures, comptes |
| `deploiement.md` | Docker, CI, nginx, `.env.example` | dev et prod, ports, secrets, CI/CD |
| `docs.md` | `docs/**`, README | DAT, ADR, journal des évolutions |

## 8. Demander avant d'agir, ou signaler

Si la tâche :
- contredit le DAT ou un ADR accepté ;
- demande un nouveau choix d'architecture : dépendance importante, nouvelle table, changement de l'authentification ou des couches. Proposer alors les options ; l'équipe tranche et rédige l'ADR ;
- dépend d'une règle encore marquée « à confirmer » dans le besoin. Ne pas inventer la règle du client ;
- ajoute une route absente de l'annexe G du DAT.

Après une modification d'architecture acceptée par l'équipe, rappeler qu'il faut mettre à jour le DAT, son journal des évolutions et, si besoin, le registre des ADR.

## 9. Ne jamais

- ajouter un ORM, un query builder ou un framework back-end ;
- écrire du SQL hors de `back/src/depots`, ou du SQL non paramétré ;
- désactiver une vérification de sécurité ou un test pour « faire passer » le pipeline ;
- commiter un secret, un fichier `.env` ou une clé ;
- modifier une migration déjà fusionnée dans `main`.

## 10. Langue

Identifiants du code en français, sans accents, comme dans le DAT (`reservation`, `exigerNiveau`, `avecTransaction`). Commentaires, documentation et messages d'erreur destinés aux utilisateurs en français.

Tout ce qui est écrit dans git et GitLab est **en anglais** : messages de commit, titres et descriptions des merge requests et des issues, commentaires de revue. Les commits et merge requests déjà faits en français restent tels quels.
