import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CONGE_REPOSITORY } from '@domain/interfaces/repositories/conge.repository';
import type { CongeRepository } from '@domain/interfaces/repositories/conge.repository';

export interface ValiderCongeInput {
  congeId: string;
  approuve: boolean;
  commentaire?: string;
}

export interface ValiderCongeOutput {
  congeId: string;
  statut: string;
}

@Injectable()
export class ValiderCongeUseCase {
  constructor(@Inject(CONGE_REPOSITORY) private congeRepository: CongeRepository) {}

  async execute(input: ValiderCongeInput): Promise<ValiderCongeOutput> {
    const conge = await this.congeRepository.findById(input.congeId);
    if (!conge) {
      throw new NotFoundException(`Congé ${input.congeId} non trouvé`);
    }

    if (!conge.isEnAttente()) {
      throw new Error(
        `Impossible de valider un congé au statut: ${conge.getStatut()}`
      );
    }

    if (input.approuve) {
      conge.approuver();
      console.log(`✅ Congé ${input.congeId} approuvé`);
    } else {
      conge.rejeter();
      console.log(`❌ Congé ${input.congeId} rejeté`);
    }

    await this.congeRepository.update(conge);

    return {
      congeId: conge.getId(),
      statut: conge.getStatut(),
    };
  }
}
