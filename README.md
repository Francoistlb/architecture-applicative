# SIRH - Système de Gestion des Congés

**Projet Architectures Applicatives — EPSI Ingénierie 1 EISI**

## Apprenant

| Nom | Prénom | Email |
|-----|--------|-------|
| Talaban | François | francoistalaban.pro@gmail.com |

## Sujet

**E — Système de Gestion des Congés (SIRH)**

Application REST en NestJS/TypeScript implémentant la gestion des congés payés, RTT et urgences familiales avec un workflow d'approbation Manager → RH.

## Contraintes appliquées

| Contrainte | Implémentation |
|------------|----------------|
| Diagramme UML | [`livrable/uml.puml`](livrable/uml.puml) |
| 3 Entités | `Employee`, `Conge`, `DemandeConge` |
| 2 Value Objects | `Periode`, `NombreJours`, `TypeCongeVo` |
| Design Pattern — Factory | `application/factories/conge.factory.ts` |
| Design Pattern — Strategy | `application/strategies/calcul-jour.strategy.ts` |
| Design Pattern — Chain of Responsibility | `application/chain-of-responsability/` |
| Test avec Stub | `application/use-cases/demander-conge.use-case.spec.ts` |
| Test avec Mock | `application/use-cases/valider-conge.use-case.spec.ts` |

## Documentation complète

Voir [`livrable/README.md`](livrable/README.md) pour le détail de l'architecture, des patterns et des endpoints.

## Lancer le projet

```bash
npm install
npx prisma migrate dev
npm run start:dev
npm run test
```
