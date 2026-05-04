import { CongeRepository } from '@domain/interfaces/repositories/conge.repository';
import { Conge } from '@domain/entities/conge.entity';

/**
 * Stub : Repository en mémoire pour les tests
 * Pas de BDD, pas de Prisma, juste des données en RAM
 */
export class FakeCongeRepository implements CongeRepository {
  private conges: Map<string, Conge> = new Map();

  async save(conge: Conge): Promise<void> {
    this.conges.set(conge.getId(), conge);
  }

  async findById(id: string): Promise<Conge | null> {
    return this.conges.get(id) || null;
  }

  async findByEmployeeId(employeeId: string): Promise<Conge[]> {
    return Array.from(this.conges.values()).filter(
      (c) => c.getEmployeeId() === employeeId
    );
  }

  async update(conge: Conge): Promise<void> {
    this.conges.set(conge.getId(), conge);
  }

  async delete(id: string): Promise<void> {
    this.conges.delete(id);
  }

  async findAll(): Promise<Conge[]> {
    return Array.from(this.conges.values());
  }

  async findPendingByEmployeeId(employeeId: string): Promise<Conge[]> {
    return Array.from(this.conges.values()).filter(
      (c) => c.getEmployeeId() === employeeId && c.isEnAttente()
    );
  }

  async findApprovedInPeriod(
    employeeId: string,
    dateDebut: Date,
    dateFin: Date
  ): Promise<Conge[]> {
    return Array.from(this.conges.values()).filter(
      (c) =>
        c.getEmployeeId() === employeeId &&
        c.isApprouve() &&
        c.getDateDebut() >= dateDebut &&
        c.getDateFin() <= dateFin
    );
  }
}
