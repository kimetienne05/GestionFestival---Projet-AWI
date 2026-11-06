---
paths:
  - "front/**"
---

# Front-end (Angular)

Références : DAT section 4.1, section 6 (sécurité), annexe C (droits), ADR-006.

## Syntaxe imposée (Angular ≥ 22)

- Composants `standalone`, sans `NgModule`.
- Signaux (`signal`, `computed`) et `inject()` ; pas d'injection par le constructeur.
- Contrôle de flux `@if` / `@for` / `@switch` ; jamais `*ngIf` ni `*ngFor`.

## Organisation

- Un dossier par fonctionnalité dans `front/src/app/features/` (festivals, structures, jeux, suivi, reservations, facturation, comptes).
- `core/` : authentification, intercepteurs, gardes ; `shared/` : composants réutilisables (`carte-festival`…).
- Routes chargées à la demande (`loadChildren`), gardes `canMatch` selon le niveau du compte.
- Fichiers et dossiers en kebab-case ; signaux nommés d'après leur contenu, sans suffixe (`festivalCourant`).

## État et appels à l'API

- Chaque service expose l'état de sa ressource par des signaux en lecture seule, et des `computed` pour les valeurs dérivées (tables restantes, reste à payer). Pas de NgRx.
- `SessionService` garde le profil (login, niveau, trésorier), jamais le jeton. `FestivalCourantService` : par défaut le dernier festival créé.
- Un service par ressource, `HttpClient` avec `withCredentials`.
- URL de l'API **relative** : `/api/v1/...`. Jamais `http://localhost:3000` : le proxy de `ng serve` (`proxy.conf.json`) et nginx en prod relaient `/api` vers l'API, donc pas de CORS.
- Un intercepteur redirige vers `/connexion` sur 401 et affiche les messages 403 et 409.

## Sécurité

- Une garde Angular sert seulement à l'ergonomie : la sécurité est dans l'API.
- Ne jamais utiliser `innerHTML` avec des données non nettoyées.
- Le visiteur (sans compte) ne voit aucune donnée financière ni personnelle.
