import { Periode } from '@domain/value-objects/periode.vo';

/**
 * Strategy Pattern : abstraction pour le calcul des jours selon le type de congé
 */
export interface ICalculJoursStrategy {
  calculer(periode: Periode): number;
}

/**
 * Stratégie 1 : Calcul en jours ouvrés (lun-ven, sans jours fériés)
 * Utilisée pour les congés payés et RTT
 */
export class CalculJoursOuvres implements ICalculJoursStrategy {
  /**
   * Calcule le nombre de jours ouvrés entre deux dates
   * Jours fériés français ignorés pour simplifier (à améliorer)
   */
  calculer(periode: Periode): number {
    return periode.getNombreJoursOuvres();
  }
}

/**
 * Stratégie 2 : Calcul en jours calendaires (incluant WE et jours fériés)
 * Utilisée pour les urgences familiales
 */
export class CalculJoursCalendaires implements ICalculJoursStrategy {
  /**
   * Calcule le nombre de jours calendaires entre deux dates
   */
  calculer(periode: Periode): number {
    return periode.getNombreJoursCalendaires();
  }
}

/**
 * Factory helper pour obtenir la bonne stratégie selon le type de congé
 */
export class CalculJoursStrategyFactory {
  static creer(typeConge: 'CONGE_PAYEE' | 'RTT' | 'URGENCE_FAMILIALE'): ICalculJoursStrategy {
    switch (typeConge) {
      case 'CONGE_PAYEE':
      case 'RTT':
        return new CalculJoursOuvres();
      case 'URGENCE_FAMILIALE':
        return new CalculJoursCalendaires();
      default:
        throw new Error(`Type de congé non supporté: ${typeConge}`);
    }
  }
}