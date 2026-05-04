import { Conge } from '@domain/entities/conge.entity';

export const CONGE_REPOSITORY = 'CONGE_REPOSITORY';

export interface CongeRepository {
  /**
   * Persiste un nouveau congé
   */
  save(conge: Conge): Promise<void>;

  /**
   * Récupère un congé par son ID
   */
  findById(id: string): Promise<Conge | null>;

  /**
   * Récupère tous les congés d'un employé
   */
  findByEmployeeId(employeeId: string): Promise<Conge[]>;

  /**
   * Métier : récupère les congés en attente d'un employé
   */
  findPendingByEmployeeId(employeeId: string): Promise<Conge[]>;

  /**
   * Métier : récupère les congés approuvés dans une période
   */
  findApprovedInPeriod(
    employeeId: string,
    dateDebut: Date,
    dateFin: Date
  ): Promise<Conge[]>;

  /**
   * Met à jour un congé
   */
  update(conge: Conge): Promise<void>;

  /**
   * Supprime un congé
   */
  delete(id: string): Promise<void>;

  /**
   * Récupère tous les congés
   */
  findAll(): Promise<Conge[]>;
}