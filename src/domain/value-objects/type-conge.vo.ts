/**
 * Value Object énumérant les types de congé
 * Extrait de conge.entity.ts pour isolation du concept
 */
export enum TypeConge {
  CONGE_PAYEE = 'CONGE_PAYEE',
  RTT = 'RTT',
  URGENCE_FAMILIALE = 'URGENCE_FAMILIALE',
}

/**
 * Helper pour valider et manipuler les types de congé
 */
export class TypeCongeVo {
  private readonly type: TypeConge;

  constructor(type: TypeConge | string) {
    this.type = this.validate(type);
  }

  /**
   * Vérifie si le type requiert une validation du manager
   */
  requiresManagerValidation(): boolean {
    return this.type !== TypeConge.URGENCE_FAMILIALE;
  }

  /**
   * Vérifie si le type requiert une validation des RH
   */
  requiresRHValidation(): boolean {
    return true; // Tous les types requièrent RH
  }

  /**
   * Récupère le quota d'urgence spécial si applicable
   */
  getQuotaSpecial(): number | null {
    return this.type === TypeConge.URGENCE_FAMILIALE ? 3 : null;
  }

  getValue(): TypeConge {
    return this.type;
  }

  equals(autre: TypeCongeVo): boolean {
    return this.type === autre.type;
  }

  private validate(type: TypeConge | string): TypeConge {
    if (!Object.values(TypeConge).includes(type as TypeConge)) {
      throw new Error(`Type de congé invalide: ${type}`);
    }
    return type as TypeConge;
  }
}