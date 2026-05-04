import { Conge, TypeConge, StatutConge } from '@domain/entities/conge.entity';
import { Periode } from '@domain/value-objects/periode.vo';
import { TypeCongeVo } from '@domain/value-objects/type-conge.vo';
import { CalculJoursStrategyFactory } from '../strategies/calcul-jour.strategy';

/**
 * Factory Pattern : crée des Congé avec les règles métier appropriées
 * selon le type de congé
 */
export class CongeFactory {
  /**
   * Crée un Congé avec les règles métier initiales
   * @throws Error si les règles métier ne sont pas respectées
   */
  static creer(props: {
    id: string;
    employeeId: string;
    type: TypeConge;
    periode: Periode;
    motif?: string;
  }): Conge {
    // Valider le type de congé
    const typeCongeVo = new TypeCongeVo(props.type);

    // Calculer le nombre de jours selon la stratégie
    const strategieCalcul = CalculJoursStrategyFactory.creer(props.type);
    const nombreJours = strategieCalcul.calculer(props.periode);

    // Créer le Congé avec les règles initiales
    const conge = new Conge({
      id: props.id,
      type: props.type,
      dateDebut: props.periode.getDateDebut(),
      dateFin: props.periode.getDateFin(),
      nombreJour: nombreJours,
      motif: props.motif,
      statut: StatutConge.EN_ATTENTE,
      employeeId: props.employeeId,
    });

    // Valider les règles spécifiques au type
    this.validateByType(props.type, conge);

    return conge;
  }

  /**
   * Valide les règles métier selon le type de congé
   */
  private static validateByType(type: TypeConge, conge: Conge): void {
    switch (type) {
      case TypeConge.URGENCE_FAMILIALE:
        // Les urgences familiales ont un quota limité (3 jours)
        if (conge.getNombreJour() > 3) {
          throw new Error(
            `Une urgence familiale ne peut pas dépasser 3 jours. Demandé: ${conge.getNombreJour()}`
          );
        }
        break;

      case TypeConge.CONGE_PAYEE:
        // Les congés payés ne peuvent pas être négatifs
        if (conge.getNombreJour() < 0) {
          throw new Error('Le nombre de jours de congé ne peut pas être négatif');
        }
        break;

      case TypeConge.RTT:
        // Les RTT doivent être des demi-journées ou journées complètes
        if (conge.getNombreJour() % 0.5 !== 0) {
          throw new Error('Les RTT doivent être par demi-journées ou journées complètes');
        }
        break;
    }
  }

  /**
   * Crée une demande de congé avec les validations initiales
   * (utile pour le workflow d'approbation)
   */
  static creerDemande(props: {
    id: string;
    employeeId: string;
    type: TypeConge;
    periode: Periode;
    motif?: string;
  }): Conge {
    return this.creer(props);
  }
}