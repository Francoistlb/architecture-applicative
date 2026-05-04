-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateEmbauche" DATETIME NOT NULL,
    "soldeCongePayes" REAL NOT NULL DEFAULT 25,
    "soldeRTT" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Conge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'CONGE_PAYEE',
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME NOT NULL,
    "nombreJour" REAL NOT NULL,
    "motif" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "employeeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Conge_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DemandeConge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "congeId" TEXT NOT NULL,
    "statutDemande" TEXT NOT NULL DEFAULT 'EN_ATTENTE_MANAGER',
    "commentaire" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DemandeConge_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DemandeConge_congeId_fkey" FOREIGN KEY ("congeId") REFERENCES "Conge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Approbation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "approbateurId" TEXT NOT NULL,
    "congeId" TEXT NOT NULL,
    "demandeCongeId" TEXT NOT NULL,
    "etape" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "commentaire" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Approbation_approbateurId_fkey" FOREIGN KEY ("approbateurId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Approbation_congeId_fkey" FOREIGN KEY ("congeId") REFERENCES "Conge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Approbation_demandeCongeId_fkey" FOREIGN KEY ("demandeCongeId") REFERENCES "DemandeConge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
