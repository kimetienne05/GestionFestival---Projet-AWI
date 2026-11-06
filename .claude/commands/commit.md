---
description: Propose un message de commit conforme à CONTRIBUTING.md, puis commite après confirmation
argument-hint: "[numéro d'issue]"
---

Prépare un commit des changements **indexés**, selon `conventions/CONTRIBUTING.md` (section 3).

1. Lis `git status`, `git diff --cached` et `git branch --show-current`.
   - Rien d'indexé : dis-le, montre les fichiers modifiés et arrête-toi. N'indexe rien sans accord.
   - Branche `main` ou `develop` : préviens qu'on ne commite pas directement dessus et propose de créer une branche `type/numero-issue-description`.
   - Si un fichier indexé ressemble à un secret (`.env`, clé, mot de passe en clair), arrête-toi et signale-le.
2. Numéro d'issue : `$ARGUMENTS` s'il est donné, sinon celui du nom de la branche (`feat/28-…` → 28). Sans numéro, demande-le.
3. Rédige le message :
   - première ligne `type(portée): description`, 72 caractères au plus, à l'impératif, en minuscules, sans point final ;
   - types : `feat`, `fix`, `docs`, `test`, `refactor`, `style`, `perf`, `build`, `ci`, `chore` ;
   - portées : `front`, `api`, `db`, `ci`, `docker`, `docs`, ou une fonctionnalité (`reservations`, `factures`, `festivals`, `structures`, `jeux`, `suivi`, `auth`, `comptes`) ;
   - `!` après le type si le changement casse la compatibilité (route, schéma), avec le détail dans le corps ;
   - corps facultatif : pourquoi, pas comment ;
   - dernière ligne : `Refs #n`, ou `Closes #n` si le commit termine l'issue.
   Si les changements mélangent plusieurs sujets, propose de les découper en plusieurs commits.
4. Affiche le message proposé et **attends la confirmation** de l'utilisateur. Ne lance pas `git commit` avant.
5. Après confirmation, commite avec ce message exact. Si le crochet `.githooks/commit-msg` refuse le message, affiche son explication et propose une correction.
