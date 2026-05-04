import { DemanderCongeUseCase } from './DemanderCongeUseCase';
import { FakeCongeRepository } from '@tests/stubs/fake-conge.repository';
import { TypeConge } from '@domain/entities/conge.entity';

describe('DemanderCongeUseCase', () => {
  let useCase: DemanderCongeUseCase;
  let repository: FakeCongeRepository;

  beforeEach(async () => {
    repository = new FakeCongeRepository();
    useCase = new DemanderCongeUseCase(repository);
  });

  it('devrait créer une demande de congé', async () => {
    const input = {
      employeeId: 'emp-123',
      type: TypeConge.CONGE_PAYEE,
      dateDebut: new Date('2026-05-01'),
      dateFin: new Date('2026-05-05'),
      motif: 'Vacances d\'été',
    };

    const result = await useCase.execute(input);

    expect(result.congeId).toBeDefined();
    expect(result.statut).toBe('EN_ATTENTE');
    expect(result.nombreJours).toBeGreaterThan(0);
  });

  it('devrait persister le congé en mémoire', async () => {
    const input = {
      employeeId: 'emp-123',
      type: TypeConge.RTT,
      dateDebut: new Date('2026-06-01'),
      dateFin: new Date('2026-06-02'),
    };

    const result = await useCase.execute(input);
    const conge = await repository.findById(result.congeId);

    expect(conge).toBeDefined();
    expect(conge?.getEmployeeId()).toBe('emp-123');
  });
});
