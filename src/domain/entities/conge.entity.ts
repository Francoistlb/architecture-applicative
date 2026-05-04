export enum TypeConge {
  CONGE_PAYEE = 'CONGE_PAYEE',
  RTT = 'RTT',
  URGENCE_FAMILIALE = 'URGENCE_FAMILIALE',
}

export enum StatutConge {
  EN_ATTENTE = 'EN_ATTENTE',
  APPROUVE = 'APPROUVE',
  REJETEE = 'REJETEE',
  ANNULEE = 'ANNULEE',
}

export class Conge {
  private id: string;
  private type: TypeConge;
  private dateDebut: Date;
  private dateFin: Date;
  private nombreJour: number;
  private motif?: string;
  private statut: StatutConge;
  private employeeId: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id: string;
    type: TypeConge;
    dateDebut: Date;
    dateFin: Date;
    nombreJour: number;
    motif?: string;
    statut?: StatutConge;
    employeeId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.validateDates(props.dateDebut, props.dateFin);

    this.id = props.id;
    this.type = props.type;
    this.dateDebut = props.dateDebut;
    this.dateFin = props.dateFin;
    this.nombreJour = props.nombreJour;
    this.motif = props.motif;
    this.statut = props.statut ?? StatutConge.EN_ATTENTE;
    this.employeeId = props.employeeId;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getType(): TypeConge {
    return this.type;
  }

  getDateDebut(): Date {
    return this.dateDebut;
  }

  getDateFin(): Date {
    return this.dateFin;
  }

  getNombreJour(): number {
    return this.nombreJour;
  }

  getMotif(): string | undefined {
    return this.motif;
  }

  getStatut(): StatutConge {
    return this.statut;
  }

  getEmployeeId(): string {
    return this.employeeId;
  }

  // Métiers
  /**
   * Approuve le congé
   */
  approuver(): void {
    if (this.statut !== StatutConge.EN_ATTENTE) {
      throw new Error(
        `Impossible d'approuver un congé au statut: ${this.statut}`
      );
    }
    this.statut = StatutConge.APPROUVE;
    this.updatedAt = new Date();
  }

  /**
   * Rejette le congé
   */
  rejeter(): void {
    if (this.statut !== StatutConge.EN_ATTENTE) {
      throw new Error(`Impossible de rejeter un congé au statut: ${this.statut}`);
    }
    this.statut = StatutConge.REJETEE;
    this.updatedAt = new Date();
  }

  /**
   * Annule le congé (peut être fait après approbation)
   */
  annuler(): void {
    if (![StatutConge.EN_ATTENTE, StatutConge.APPROUVE].includes(this.statut)) {
      throw new Error(`Impossible d'annuler un congé au statut: ${this.statut}`);
    }
    this.statut = StatutConge.ANNULEE;
    this.updatedAt = new Date();
  }

  /**
   * Vérifie si le congé est approuvé
   */
  isApprouve(): boolean {
    return this.statut === StatutConge.APPROUVE;
  }

  /**
   * Vérifie si le congé est en attente
   */
  isEnAttente(): boolean {
    return this.statut === StatutConge.EN_ATTENTE;
  }

  /**
   * Valide que la date de fin est après la date de début
   */
  private validateDates(dateDebut: Date, dateFin: Date): void {
    if (dateFin <= dateDebut) {
      throw new Error('La date de fin doit être après la date de début');
    }
  }

  /**
   * Vérifie si le congé est pour une urgence familiale
   */
  isUrgenceFamiliale(): boolean {
    return this.type === TypeConge.URGENCE_FAMILIALE;
  }
}