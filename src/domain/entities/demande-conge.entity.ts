export enum StatutDemande {
  EN_ATTENTE_MANAGER = 'EN_ATTENTE_MANAGER',
  MANAGER_APPROUVE = 'MANAGER_APPROUVE',
  EN_ATTENTE_RH = 'EN_ATTENTE_RH',
  RH_APPROUVEE = 'RH_APPROUVEE',
  REJETEE = 'REJETEE',
}

export class DemandeConge {
  private id: string;
  private employeeId: string;
  private congeId: string;
  private statutDemande: StatutDemande;
  private commentaire?: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id: string;
    employeeId: string;
    congeId: string;
    statutDemande?: StatutDemande;
    commentaire?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.employeeId = props.employeeId;
    this.congeId = props.congeId;
    this.statutDemande = props.statutDemande ?? StatutDemande.EN_ATTENTE_MANAGER;
    this.commentaire = props.commentaire;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  getId(): string {
    return this.id;
  }

  getEmployeeId(): string {
    return this.employeeId;
  }

  getCongeId(): string {
    return this.congeId;
  }

  getStatutDemande(): StatutDemande {
    return this.statutDemande;
  }

  getCommentaire(): string | undefined {
    return this.commentaire;
  }

  validerParManager(commentaire?: string): void {
    if (this.statutDemande !== StatutDemande.EN_ATTENTE_MANAGER) {
      throw new Error(
        `Validation manager impossible depuis le statut: ${this.statutDemande}`
      );
    }
    this.statutDemande = StatutDemande.MANAGER_APPROUVE;
    this.commentaire = commentaire;
    this.updatedAt = new Date();
  }

  transmettreRH(): void {
    if (this.statutDemande !== StatutDemande.MANAGER_APPROUVE) {
      throw new Error('La demande doit être approuvée par le manager avant la RH');
    }
    this.statutDemande = StatutDemande.EN_ATTENTE_RH;
    this.updatedAt = new Date();
  }

  validerParRH(commentaire?: string): void {
    if (this.statutDemande !== StatutDemande.EN_ATTENTE_RH) {
      throw new Error(
        `Validation RH impossible depuis le statut: ${this.statutDemande}`
      );
    }
    this.statutDemande = StatutDemande.RH_APPROUVEE;
    this.commentaire = commentaire;
    this.updatedAt = new Date();
  }

  rejeter(commentaire?: string): void {
    if (this.statutDemande === StatutDemande.RH_APPROUVEE) {
      throw new Error('Impossible de rejeter une demande déjà approuvée par la RH');
    }
    this.statutDemande = StatutDemande.REJETEE;
    this.commentaire = commentaire;
    this.updatedAt = new Date();
  }

  isApprouveeFinalement(): boolean {
    return this.statutDemande === StatutDemande.RH_APPROUVEE;
  }

  isEnAttente(): boolean {
    return (
      this.statutDemande === StatutDemande.EN_ATTENTE_MANAGER ||
      this.statutDemande === StatutDemande.EN_ATTENTE_RH
    );
  }
}
