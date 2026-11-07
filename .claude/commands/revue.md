---
description: Relit une branche ou une merge request avec la liste de vérification de l'équipe
argument-hint: "[branche cible, par défaut develop]"
---

Relis les changements de la branche courante par rapport à `$ARGUMENTS` (par défaut `develop`) : `git fetch`, puis `git diff origin/<cible>...HEAD` et `git log origin/<cible>..HEAD`.

Vérifie chaque point de `CONTRIBUTING.md` (section 4) et des règles de `.claude/rules/` :

1. **DAT et ADR** : couches respectées (ADR-005), droits vérifiés dans l'API (annexe C), masquage par liste blanche (ADR-002), routes présentes dans l'annexe G.
2. **SQL** : uniquement dans `back/src/depots`, toujours paramétré ; transactions et verrous là où plusieurs tables sont écrites (ADR-008).
3. **Secrets** : aucun mot de passe, clé, jeton ni fichier `.env` dans le diff.
4. **Tests** : présents pour tout nouveau comportement ; aucun des quatre tests obligatoires affaibli.
5. **Noms** : conformes à CONTRIBUTING (fichiers, identifiants en français, tables, routes) ; branche et messages de commit au bon format, messages de commit en anglais.
6. **Base** : nouvelle migration plutôt que modification d'une migration fusionnée ; migration additive.
7. **DAT** : si l'architecture change, le DAT et son journal des évolutions sont-ils à mettre à jour ?

Rends un compte rendu en français : d'abord les problèmes bloquants, avec `fichier:ligne` et la correction proposée ; puis les remarques mineures ; puis ce qui est conforme, en une ligne. Ne modifie aucun fichier.
