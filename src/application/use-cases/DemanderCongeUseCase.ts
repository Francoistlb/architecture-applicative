// src/application/use-cases/DemanderCongeUseCase.ts

import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CONGE_REPOSITORY } from '@domain/interfaces/repositories/conge.repository';
import type { CongeRepository } from '@domain/interfaces/repositories/conge.repository';
import { Conge, TypeConge } from '@domain/entities/conge.entity';
import { Periode } from '@domain/value-objects/periode.vo';
import { CongeFactory } from '../factories/conge.factory';

export interface DemanderCongeInput {
  employeeId: string;
  type: TypeConge;
  dateDebut: Date;
  dateFin: Date;
  motif?: string;
}

export interface DemanderCongeOutput {
  congeId: string;
  statut: string;
  nombreJours: number;
}

/**
 * Use Case : Demander un congé
 * Orchestration entre les entités, le factory, et la validation
 */
@Injectable()
export class DemanderCongeUseCase {
  constructor(@Inject(CONGE_REPOSITORY) private congeRepository: CongeRepository) {}

  async execute(input: DemanderCongeInput): Promise<DemanderCongeOutput> {
    // 1. Créer la période
    const periode = new Periode(input.dateDebut, input.dateFin);

    // 2. Créer le congé via la Factory (qui applique les règles métier)
    const conge = CongeFactory.creer({
      id: randomUUID(),
      employeeId: input.employeeId,
      type: input.type,
      periode,
      motif: input.motif,
    });

    // 3. Persister en BDD
    await this.congeRepository.save(conge);

    // 4. Retourner le résultat
    return {
      congeId: conge.getId(),
      statut: conge.getStatut(),
      nombreJours: conge.getNombreJour(),
    };
  }
}