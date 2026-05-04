/**
 * Chain of Responsibility : Handler abstrait pour la validation
 * Chaque handler valide une étape et passe au suivant
 */
export abstract class ValidationHandler {
  protected next: ValidationHandler | null = null;

  /**
   * Chaîne le prochain handler
   */
  setNext(handler: ValidationHandler): ValidationHandler {
    this.next = handler;
    return handler;
  }

  /**
   * Traite la validation : valide localement, puis passe au suivant
   */
  async handle(context: ValidationContext): Promise<void> {
    // Valider à ce niveau
    await this.validate(context);

    // Passer au suivant s'il existe
    if (this.next) {
      await this.next.handle(context);
    }
  }

  /**
   * À implémenter dans les sous-classes
   */
  protected abstract validate(context: ValidationContext): Promise<void>;
}

/**
 * Contexte partagé entre les handlers
 */
export interface ValidationContext {
  congeId: string;
  employeeId: string;
  typeConge: string;
  nombreJours: number;
  dateDebut: Date;
  dateFin: Date;
  errors: string[];
}