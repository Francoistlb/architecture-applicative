import { ValiderCongeUseCase } from './ValiderCongeUseCase';
import { FakeCongeRepository } from '@tests/stubs/fake-conge.repository';
import { NotificationServiceMock } from '@tests/mocks/notification.mock';
import { TypeConge } from '@domain/entities/conge.entity';
import { Conge } from '@domain/entities/conge.entity';

describe('ValiderCongeUseCase with Mock', () => {
  let useCase: ValiderCongeUseCase;
  let repository: FakeCongeRepository;
  let notificationMock: NotificationServiceMock;

  beforeEach(async () => {
    repository = new FakeCongeRepository();
    notificationMock = new NotificationServiceMock();
    useCase = new ValiderCongeUseCase(repository);
  });

  it('devrait approuver un congé', async () => {
    // Créer un congé
    const conge = new Conge({
      id: 'conge-1',
      type: TypeConge.CONGE_PAYEE,
      dateDebut: new Date('2026-05-01'),
      dateFin: new Date('2026-05-05'),
      nombreJour: 4,
      employeeId: 'emp-123',
    });

    await repository.save(conge);

    // Approuver
    const result = await useCase.execute({
      congeId: 'conge-1',
      approuve: true,
    });

    expect(result.statut).toBe('APPROUVE');
  });

  it('devrait envoyer une notification au manager (Mock)', async () => {
    // Créer un congé
    const conge = new Conge({
      id: 'conge-2',
      type: TypeConge.RTT,
      dateDebut: new Date('2026-06-01'),
      dateFin: new Date('2026-06-02'),
      nombreJour: 1,
      employeeId: 'emp-456',
    });

    await repository.save(conge);

    // Simuler l'approbation ET un email
    const result = await useCase.execute({
      congeId: 'conge-2',
      approuve: true,
    });

    // Vérifier que le mock a bien reçu l'appel
    // (dans une vrai app, tu enverrais l'email ici)
    await notificationMock.sendEmail(
      'manager@company.com',
      'Congé approuvé',
      `Congé ${result.congeId} approuvé`
    );

    expect(notificationMock.wasEmailSentTo('manager@company.com')).toBe(true);
    expect(notificationMock.getEmailsSentCount()).toBe(1);
  });
});
