export class Employee {
  private id: string;
  private email: string;
  private nom: string;
  private prenom: string;
  private dateEmbauche: Date;
  private soldeCongePayes: number;
  private soldeRTT: number;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    dateEmbauche: Date;
    soldeCongePayes?: number;
    soldeRTT?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.email = this.validateEmail(props.email);
    this.nom = props.nom;
    this.prenom = props.prenom;
    this.dateEmbauche = props.dateEmbauche;
    this.soldeCongePayes = props.soldeCongePayes ?? 25;
    this.soldeRTT = props.soldeRTT ?? 0;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getNom(): string {
    return this.nom;
  }

  getPrenom(): string {
    return this.prenom;
  }

  getDateEmbauche(): Date {
    return this.dateEmbauche;
  }

  getSoldeCongePayes(): number {
    return this.soldeCongePayes;
  }

  getSoldeRTT(): number {
    return this.soldeRTT;
  }

  // Métiers
  /**
   * Déduit des jours de congé payés
   * @throws Error si solde insuffisant
   */
  deduireCongePayes(nombreJours: number): void {
    if (nombreJours > this.soldeCongePayes) {
      throw new Error(
        `Solde insuffisant. Disponible: ${this.soldeCongePayes}, Demandé: ${nombreJours}`
      );
    }
    this.soldeCongePayes -= nombreJours;
    this.updatedAt = new Date();
  }

  /**
   * Déduit des jours RTT
   * @throws Error si solde insuffisant
   */
  deduireRTT(nombreJours: number): void {
    if (nombreJours > this.soldeRTT) {
      throw new Error(
        `Solde RTT insuffisant. Disponible: ${this.soldeRTT}, Demandé: ${nombreJours}`
      );
    }
    this.soldeRTT -= nombreJours;
    this.updatedAt = new Date();
  }

  /**
   * Ajoute des jours de congé payés
   */
  ajouterCongePayes(nombreJours: number): void {
    this.soldeCongePayes += nombreJours;
    this.updatedAt = new Date();
  }

  /**
   * Ajoute des jours RTT
   */
  ajouterRTT(nombreJours: number): void {
    this.soldeRTT += nombreJours;
    this.updatedAt = new Date();
  }

  /**
   * Valide l'email
   */
  private validateEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Email invalide: ${email}`);
    }
    return email;
  }
}