# SIRH - Système de Gestion des Congés

**Projet Architectures Applicatives — EPSI Ingénierie 1 EISI**

## Apprenant

| Nom | Prénom | Email |
|-----|--------|-------|
| Talaban | François | francoistalaban.pro@gmail.com |

---

## Sujet : E — Système de Gestion des Congés (SIRH)

Application interne d'entreprise permettant aux employés de poser leurs congés payés, leurs RTT et leurs urgences familiales.

### Règles métier implémentées

- **Calcul des jours réels** — seuls les jours ouvrés (lundi–vendredi) sont comptabilisés pour les congés payés et RTT ; les urgences familiales comptent en jours calendaires.
- **Anticipation stricte** — les RTT doivent être posés au moins 1 jour à l'avance via la chaîne d'approbation.
- **Quota spécial Urgence Familiale** — limité à 3 jours, calculés en jours calendaires.
- **Workflow d'approbation** — toute demande passe par une chaîne Manager → RH avant d'être validée.

---

## Stack technique

| Élément | Choix |
|---------|-------|
| Langage | TypeScript |
| Framework | NestJS |
| ORM | Prisma |
| Base de données | SQLite (`prisma/dev.db`) |
| Tests | Jest |

---

## Lancer le projet

```bash
# Installer les dépendances
npm install

# Appliquer les migrations (crée la BDD SQLite)
npx prisma migrate dev

# Démarrer en mode développement
npm run start:dev

# Lancer les tests
npm run test
```

---

## Architecture — Domain Driven Design

Le projet suit une architecture DDD en 3 couches :

```
src/
├── domain/             # Coeur métier (entités, value objects, interfaces)
├── application/        # Orchestration (use cases, patterns)
└── infrastructure/     # Technique (contrôleurs HTTP, Prisma, repositories)
```

### Séparation des responsabilités

Les contrôleurs (`infrastructure/http/controllers/`) ne contiennent aucune logique métier. Ils délèguent intégralement aux **use cases** (`application/use-cases/`), qui eux-mêmes s'appuient sur les **entités** et **value objects** du domaine.

---

## Contraintes du TP

### 1. Diagramme de classes UML

Voir le fichier [`uml.puml`](./uml.puml) (PlantUML).

Il représente les 3 entités, les 3 value objects, le repository et leurs relations.

---

### 2. Entités (3)

| Entité | Fichier | Rôle |
|--------|---------|------|
| `Employee` | `domain/entities/employee.entity.ts` | Employé avec soldes de congés. Méthodes : `deduireCongePayes()`, `deduireRTT()`, `ajouterCongePayes()`, `ajouterRTT()`. |
| `Conge` | `domain/entities/conge.entity.ts` | Demande de congé avec cycle de vie. Méthodes : `approuver()`, `rejeter()`, `annuler()`. Valide que `dateFin > dateDebut`. |
| `DemandeConge` | `domain/entities/demande-conge.entity.ts` | Suivi du workflow d'approbation. Méthodes : `validerParManager()`, `transmettreRH()`, `validerParRH()`, `rejeter()`. Impose la séquence des transitions de statut. |

---

### 3. Value Objects (3)

| Value Object | Fichier | Rôle |
|--------------|---------|------|
| `NombreJours` | `domain/value-objects/nombre-jours.vo.ts` | Encapsule un nombre de jours. Immuable. Valide : non-négatif, max 365, précision 0.5 jour. Opérations : `add()`, `subtract()`. |
| `Periode` | `domain/value-objects/periode.vo.ts` | Encapsule un intervalle de dates. Immuable. Calcule les **jours ouvrés** (hors week-ends) via `getNombreJoursOuvres()` et les jours calendaires via `getNombreJoursCalendaires()`. |
| `TypeCongeVo` | `domain/value-objects/type-conge.vo.ts` | Encapsule le type de congé. Expose `requiresManagerValidation()`, `requiresRHValidation()`, `getQuotaSpecial()`. |

---

### 4. Design Patterns (3, hors MVC)

#### Pattern 1 — Factory (`application/factories/conge.factory.ts`)

`CongeFactory.creer()` centralise la création des entités `Conge`. Elle sélectionne la bonne stratégie de calcul, instancie la `Periode`, puis applique les règles de validation spécifiques au type (ex : quota 3 jours pour `URGENCE_FAMILIALE`, granularité 0,5 jour pour `RTT`).

```
CongeFactory
  └── creer(props) : Conge
        ├── new TypeCongeVo(type)
        ├── CalculJoursStrategyFactory.creer(type)  →  stratégie
        └── validateByType(type, conge)
```

#### Pattern 2 — Strategy (`application/strategies/calcul-jour.strategy.ts`)

Deux algorithmes de calcul interchangeables, sélectionnés à la création par la Factory :

| Stratégie | Classe | Utilisée pour |
|-----------|--------|---------------|
| Jours ouvrés | `CalculJoursOuvres` | `CONGE_PAYEE`, `RTT` |
| Jours calendaires | `CalculJoursCalendaires` | `URGENCE_FAMILIALE` |

#### Pattern 3 — Chain of Responsibility (`application/chain-of-responsability/`)

Le workflow d'approbation est une chaîne de handlers :

```
ManagerValidationHandler  →  RHValidationHandler
```

Chaque handler valide ses propres règles (ex : anticipation minimale pour le manager, nombre de jours maximum pour la RH) puis transmet au suivant. Implémenté dans `ValidateCongeChainUseCase`.

---

### 5. Tests automatisés

#### Test avec Stub — `demander-conge.use-case.spec.ts`

`FakeCongeRepository` (`tests/stubs/fake-conge.repository.ts`) est un **Stub** : implémentation en mémoire de l'interface `CongeRepository`. Il remplace Prisma/SQLite pour isoler le use case `DemanderCongeUseCase`.

```typescript
repository = new FakeCongeRepository();  // Stub en mémoire
useCase = new DemanderCongeUseCase(repository);

// Vérifie que le congé est créé EN_ATTENTE
expect(result.statut).toBe('EN_ATTENTE');

// Vérifie la persistance en mémoire
const conge = await repository.findById(result.congeId);
expect(conge?.getEmployeeId()).toBe('emp-123');
```

#### Test avec Mock — `valider-conge.use-case.spec.ts`

`NotificationServiceMock` (`tests/mocks/notification.mock.ts`) est un **Mock** : il enregistre les appels reçus et expose des méthodes de vérification (`wasEmailSentTo()`, `getEmailsSentCount()`).

```typescript
notificationMock = new NotificationServiceMock();

await notificationMock.sendEmail('manager@company.com', 'Congé approuvé', ...);

// Vérification comportementale (ce qui distingue un Mock d'un Stub)
expect(notificationMock.wasEmailSentTo('manager@company.com')).toBe(true);
expect(notificationMock.getEmailsSentCount()).toBe(1);
```

---

## Endpoints REST

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/conges` | Créer une demande de congé |
| `GET` | `/conges/:id` | Récupérer un congé par ID |
| `PATCH` | `/conges/:id/valider` | Approuver ou rejeter un congé |
| `GET` | `/conges/employee/:employeeId/disponible` | Calculer les jours disponibles |

### Exemple — Créer une demande

```bash
curl -X POST http://localhost:3000/conges \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "emp-123",
    "type": "CONGE_PAYEE",
    "dateDebut": "2026-06-01",
    "dateFin": "2026-06-10",
    "motif": "Vacances"
  }'
```

### Exemple — Valider une demande

```bash
curl -X PATCH http://localhost:3000/conges/<id>/valider \
  -H "Content-Type: application/json" \
  -d '{ "approuve": true, "commentaire": "OK" }'
```
