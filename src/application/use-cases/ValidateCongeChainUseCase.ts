import { Injectable } from '@nestjs/common';
import { ManagerValidationHandler } from '../chain-of-responsability/manager-validation.handler';
import { RHValidationHandler } from '../chain-of-responsability/rh-validation.handler';
import type { ValidationContext } from '../chain-of-responsability/validation.handler';

export interface ValidateCongeChainInput {
  congeId: string;
  employeeId: string;
  typeConge: string;
  nombreJours: number;
  dateDebut: Date;
  dateFin: Date;
}

/**
 * Use Case : Valider un congé via la chaîne Manager -> RH
 * Utilise le Pattern Chain of Responsibility
 */
@Injectable()
export class ValidateCongeChainUseCase {
  async execute(input: ValidateCongeChainInput): Promise<void> {
    // Construire la chaîne : Manager -> RH
    const managerHandler = new ManagerValidationHandler();
    const rhHandler = new RHValidationHandler();
    managerHandler.setNext(rhHandler);

    // Créer le contexte de validation
    const context: ValidationContext = {
      congeId: input.congeId,
      employeeId: input.employeeId,
      typeConge: input.typeConge,
      nombreJours: input.nombreJours,
      dateDebut: input.dateDebut,
      dateFin: input.dateFin,
      errors: [],
    };

    // Exécuter la chaîne
    await managerHandler.handle(context);

    if (context.errors.length > 0) {
      throw new Error(`Validation échouée: ${context.errors.join(', ')}`);
    }
  }
}
