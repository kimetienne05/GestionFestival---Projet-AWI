---
paths:
  - "docs/**"
  - "README.md"
---

# Documentation (DAT, ADR, besoin, README)

- Le DAT est un document vivant. Toute évolution est notée dans son journal (annexe J) : version, date, évolution, raison, type (« décidée » ou « écart subi »). Un écart subi décrit : l'écart constaté, sa cause, sa conséquence, et ce qu'il faudrait faire pour revenir au plan.
- Chaque version du DAT correspond à un tag Git `dat-v*`. Ne jamais créer ni pousser ce tag : c'est une décision de l'équipe.
- ADR : format contexte, critères (fixés avant la comparaison), options, décision, conséquences. Un ADR proposé par l'IA reste « Proposée » jusqu'à son acceptation par l'équipe. Un numéro d'ADR n'est jamais réutilisé (voir ADR-004, retiré).
- Les choix imposés par l'énoncé (Angular, Node.js, PostgreSQL sans ORM, Docker Compose, GitLab CI/CD, VM) sont des contraintes, pas des ADR.
- Une hypothèse à valider par le client est marquée `[à confirmer : …]`. Ne jamais inventer la réponse du client.
- Le besoin (`docs/besoins.pdf`) fait référence en cas de désaccord avec le client.
- README : en français ; la section « Utilisation de l'IA » décrit les outils, les tâches confiées à l'IA, les vérifications et les décisions restées à l'équipe.
