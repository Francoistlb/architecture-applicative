import { ValidationHandler, ValidationContext } from './validation.handler';

/**
 * Handler 1 : Validation par le Manager
 * Vérifie que c'est conforme aux règles du département
 */
export class ManagerValidationHandler extends ValidationHandler {
  protected async validate(context: ValidationContext): Promise<void> {
    console.log(`[Manager] Validation du congé ${context.congeId}...`);

    // Règle 1 : Vérifier que la demande respecte l'anticipation (pas jour même pour RTT)
    if (context.typeConge === 'RTT') {
      const now = new Date();
      const demain = new Date(now);
      demain.setDate(demain.getDate() + 1);

      if (context.dateDebut <= demain) {
        throw new Error(
          '[Manager] Les RTT doivent être demandés au moins 1 jour à l\'avance'
        );
      }
    }

    // Règle 2 : Pas plus de 5 jours consécutifs en congé payé
    if (
      context.typeConge === 'CONGE_PAYEE' &&
      context.nombreJours > 5
    ) {
      throw new Error(
        `[Manager] Maximum 5 jours consécutifs en congé payé. Demandé: ${context.nombreJours}`
      );
    }

    console.log(`✅ [Manager] Congé ${context.congeId} approuvé`);
  }
}