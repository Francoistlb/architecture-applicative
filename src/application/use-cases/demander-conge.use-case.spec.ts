import { DemanderCongeUseCase } from './DemanderCongeUseCase';
import { FakeCongeRepository } from '@tests/stubs/fake-conge.repository';
import { TypeConge } from '@domain/entities/conge.entity';

/**
 * Tests du use case DemanderConge
 * Utilise un STUB : FakeCongeRepository (repository en mémoire, sans BDD)
 */
describe('DemanderCongeUseCase — Stub', () => {
  let useCase: DemanderCongeUseCase;
  let repository: FakeCongeRepository;

  beforeEach(() => {
    repository = new FakeCongeRepository();
    useCase = new DemanderCongeUseCase(repository);
  });

  // ─── Tests nominaux ───────────────────────────────────────────────────────

  it('devrait créer une demande de congé payé en statut EN_ATTENTE', async () => {
    const result = await useCase.execute({
      employeeId: 'emp-123',
      type: TypeConge.CONGE_PAYEE,
      dateDebut: new Date('2026-05-01'),
      dateFin: new Date('2026-05-05'),
      motif: 'Vacances',
    });

    expect(result.congeId).toBeDefined();
    expect(result.statut).toBe('EN_ATTENTE');
    expect(result.nombreJours).toBeGreaterThan(0);
  });

  it('devrait persister le congé dans le stub repository', async () => {
    const result = await useCase.execute({
      employeeId: 'emp-123',
      type: TypeConge.RTT,
      dateDebut: new Date('2026-06-02'),
      dateFin: new Date('2026-06-03'),
    });

    const conge = await repository.findById(result.congeId);

    expect(conge).toBeDefined();
    expect(conge?.getEmployeeId()).toBe('emp-123');
  });

  it('devrait calculer uniquement les jours ouvrés pour un congé payé', async () => {
    // Du lundi 01/06 au vendredi 05/06 = 5 jours ouvrés
    const result = await useCase.execute({
      employeeId: 'emp-456',
      type: TypeConge.CONGE_PAYEE,
      dateDebut: new Date('2026-06-01'),
      dateFin: new Date('2026-06-05'),
    });

    expect(result.nombreJours).toBe(5);
  });

  it('devrait calculer en jours calendaires pour une urgence familiale', async () => {
    // Du lundi 01/06 au mercredi 03/06 = 3 jours calendaires
    const result = await useCase.execute({
      employeeId: 'emp-789',
      type: TypeConge.URGENCE_FAMILIALE,
      dateDebut: new Date('2026-06-01'),
      dateFin: new Date('2026-06-03'),
      motif: 'Hospitalisation',
    });

    expect(result.nombreJours).toBe(3);
  });

  it('devrait générer un ID unique pour chaque congé', async () => {
    const input = {
      employeeId: 'emp-123',
      type: TypeConge.CONGE_PAYEE,
      dateDebut: new Date('2026-07-01'),
      dateFin: new Date('2026-07-03'),
    };

    const result1 = await useCase.execute(input);
    const result2 = await useCase.execute({ ...input, dateDebut: new Date('2026-08-01'), dateFin: new Date('2026-08-04') });

    expect(result1.congeId).not.toBe(result2.congeId);
  });

  // ─── Tests des règles métier ──────────────────────────────────────────────

  it('devrait refuser une urgence familiale dépassant 3 jours', async () => {
    await expect(
      useCase.execute({
        employeeId: 'emp-123',
        type: TypeConge.URGENCE_FAMILIALE,
        dateDebut: new Date('2026-06-01'),
        dateFin: new Date('2026-06-06'),
      })
    ).rejects.toThrow('ne peut pas dépasser 3 jours');
  });

  it('devrait refuser une demande avec dateFin avant dateDebut', async () => {
    await expect(
      useCase.execute({
        employeeId: 'emp-123',
        type: TypeConge.CONGE_PAYEE,
        dateDebut: new Date('2026-06-10'),
        dateFin: new Date('2026-06-05'),
      })
    ).rejects.toThrow();
  });
});
