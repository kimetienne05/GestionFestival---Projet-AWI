---
paths:
  - "docker-compose*.yml"
  - "**/Dockerfile"
  - "**/.dockerignore"
  - "**/nginx.conf"
  - "**/proxy.conf.json"
  - ".gitlab-ci.yml"
  - ".env.example"
---

# Docker, CI/CD et déploiement

Références : DAT sections 7 et 8, figures 5 et 6, ADR-010. Responsable du déploiement : Mathieu Marty (DAT, tableau 1).

## Deux environnements

| | `docker-compose.yml` (développement) | `docker-compose.prod.yml` (production) |
|---|---|---|
| Images | construites localement, étape `dev` des Dockerfiles | images du registre GitLab, étiquetées par le SHA court |
| Code | monté en volume (rechargement à chaud) | copié dans l'image |
| Ports publiés | 4200, 3000, 5432, sur `127.0.0.1` uniquement | seulement le port HTTPS du front |

- Les conteneurs communiquent par le réseau interne `festival_net`, par le nom du service (`db:5432`, `api:3000`).
- Volumes : `pgdata` (base), `regles` (PDF des règles), `certs` (certificat TLS, prod).
- Dockerfiles multi-étapes (`base`, `dev`, `build`, `prod`) ; en prod, l'API tourne sous l'utilisateur `node`, jamais root.
- Versions : `node:24-alpine`, `postgres:18-alpine`, `nginx:1.27-alpine`.

## Secrets

- Aucun secret dans Git : seul `.env.example` est versionné, avec des valeurs d'exemple commentées.
- En prod, les secrets sont des variables GitLab protégées et masquées (`SSH_KEY`, `JWT_SECRET`, `POSTGRES_PASSWORD`, jeton du registre), écrites dans le `.env` de la VM par le job `deploy`.

## Pipeline (`.gitlab-ci.yml`)

- Toute branche et merge request : `lint` (ESLint, Prettier, `tsc --noEmit`) puis `test` (sur un PostgreSQL du pipeline).
- `main` seulement : `build` (images poussées dans le registre, étiquette = SHA court) puis `deploy` (SSH, `pull`, `up -d`), qui échoue si `GET /api/v1/sante` ne répond pas 200 en 60 s.
- Job manuel `rollback` avec `TAG=<sha précédent>`.
- Un échec arrête le pipeline : rien n'est déployé.

## VM (162.38.111.31)

- Docker **rootless** sous le compte `mathieu.marty`, avec linger ; pas de sudo.
- Les ports inférieurs à 1024 ne sont pas publiables sans réglage de l'administrateur [à confirmer : 443 ou port haut].
- HTTPS terminé par nginx dans le conteneur front ; Let's Encrypt impossible (VM joignable seulement depuis Polytech ou le VPN).
- Sauvegarde : `pg_dump` chaque nuit et archive du volume `regles`, gardés 14 jours ; restauration testée avec `pg_restore`.
- Journaux : `docker compose logs`, rotation `json-file`, journaux d'accès nginx.
