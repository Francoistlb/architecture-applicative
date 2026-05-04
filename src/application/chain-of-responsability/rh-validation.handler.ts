import { ValidationHandler, ValidationContext } from './validation.handler';

/**
 * Handler 2 : Validation par les RH
 * Vérifie le quota disponible et les règles globales
 */
export class RHValidationHandler extends ValidationHandler {
  protected async validate(context: ValidationContext): Promise<void> {
    console.log(`[RH] Vérification du quota pour congé ${context.congeId}...`);

    // Règle 1 : Vérifier le quota (simplifié - dans un vrai système, checher la BDD)
    // Ici on simule juste une vérification
    const quotaDisponible = 25; // Supposons 25 jours par an
    
    if (context.nombreJours > quotaDisponible) {
      throw new Error(
        `[RH] Quota insuffisant. Disponible: ${quotaDisponible}, Demandé: ${context.nombreJours}`
      );
    }

    // Règle 2 : Vérifier les chevauchements (pas deux congés au même moment)
    // Dans un vrai système, faire une requête à la BDD
    const chevauchement = false; // Simplifié
    
    if (chevauchement) {
      throw new Error(
        '[RH] Cette période chevauche un autre congé déjà approuvé'
      );
    }

    console.log(`✅ [RH] Congé ${context.congeId} validé - Quota OK`);
  }
}