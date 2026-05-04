import { Injectable, Inject } from '@nestjs/common';
import { CONGE_REPOSITORY } from '@domain/interfaces/repositories/conge.repository';
import type { CongeRepository } from '@domain/interfaces/repositories/conge.repository';

export interface CalculerJoursDisponiblesInput {
  employeeId: string;
  soldeCongePayes: number;
  soldeRTT: number;
}

export interface CalculerJoursDisponiblesOutput {
  employeeId: string;
  soldeCongePayesDisponible: number;
  soldeRTTDisponible: number;
  joursEnAttente: number;
  joursApprouves: number;
}

@Injectable()
export class CalculerJoursDisponiblesUseCase {
  constructor(@Inject(CONGE_REPOSITORY) private congeRepository: CongeRepository) {}

  async execute(
    input: CalculerJoursDisponiblesInput
  ): Promise<CalculerJoursDisponiblesOutput> {
    const conges = await this.congeRepository.findByEmployeeId(
      input.employeeId
    );

    let joursEnAttente = 0;
    let joursApprouves = 0;

    conges.forEach((conge) => {
      if (conge.isEnAttente()) {
        joursEnAttente += conge.getNombreJour();
      } else if (conge.isApprouve()) {
        joursApprouves += conge.getNombreJour();
      }
    });

    return {
      employeeId: input.employeeId,
      soldeCongePayesDisponible: input.soldeCongePayes - joursApprouves,
      soldeRTTDisponible: input.soldeRTT,
      joursEnAttente,
      joursApprouves,
    };
  }
}
