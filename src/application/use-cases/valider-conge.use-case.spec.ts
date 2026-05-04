import { ValiderCongeUseCase } from './ValiderCongeUseCase';
import { FakeCongeRepository } from '@tests/stubs/fake-conge.repository';
import { NotificationServiceMock } from '@tests/mocks/notification.mock';
import { Conge, TypeConge } from '@domain/entities/conge.entity';

const makeConge = (id: string, type = TypeConge.CONGE_PAYEE) =>
  new Conge({
    id,
    type,
    dateDebut: new Date('2026-05-01'),
    dateFin: new Date('2026-05-05'),
    nombreJour: 4,
    employeeId: 'emp-123',
  });

/**
 * Tests du use case ValiderConge
 * Utilise un MOCK : NotificationServiceMock (vérifie les appels reçus)
 * et un STUB   : FakeCongeRepository     (isole la BDD)
 */
describe('ValiderCongeUseCase — Mock & Stub', () => {
  let useCase: ValiderCongeUseCase;
  let repository: FakeCongeRepository;
  let notificationMock: NotificationServiceMock;

  beforeEach(() => {
    repository = new FakeCongeRepository();
    notificationMock = new NotificationServiceMock();
    useCase = new ValiderCongeUseCase(repository);
  });

  // ─── Approbation ─────────────────────────────────────────────────────────

  it('devrait approuver un congé en attente', async () => {
    await repository.save(makeConge('conge-1'));

    const result = await useCase.execute({ congeId: 'conge-1', approuve: true });

    expect(result.statut).toBe('APPROUVE');
  });

  it('devrait rejeter un congé en attente', async () => {
    await repository.save(makeConge('conge-2'));

    const result = await useCase.execute({ congeId: 'conge-2', approuve: false });

    expect(result.statut).toBe('REJETEE');
  });

  it('devrait retourner le congeId dans la réponse', async () => {
    await repository.save(makeConge('conge-3'));

    const result = await useCase.execute({ congeId: 'conge-3', approuve: true });

    expect(result.congeId).toBe('conge-3');
  });

  // ─── Erreurs métier ───────────────────────────────────────────────────────

  it('devrait lever une erreur si le congé est introuvable', async () => {
    await expect(
      useCase.execute({ congeId: 'inexistant', approuve: true })
    ).rejects.toThrow('non trouvé');
  });

  it('devrait lever une erreur si on approuve un congé déjà approuvé', async () => {
    const conge = makeConge('conge-4');
    conge.approuver();
    await repository.save(conge);

    await expect(
      useCase.execute({ congeId: 'conge-4', approuve: true })
    ).rejects.toThrow();
  });

  it('devrait lever une erreur si on rejette un congé déjà rejeté', async () => {
    const conge = makeConge('conge-5');
    conge.rejeter();
    await repository.save(conge);

    await expect(
      useCase.execute({ congeId: 'conge-5', approuve: false })
    ).rejects.toThrow();
  });

  // ─── Vérifications Mock ───────────────────────────────────────────────────

  it('le mock doit enregistrer un email envoyé au manager', async () => {
    await repository.save(makeConge('conge-6'));
    const result = await useCase.execute({ congeId: 'conge-6', approuve: true });

    await notificationMock.sendEmail(
      'manager@company.com',
      'Congé approuvé',
      `Congé ${result.congeId} approuvé`
    );

    expect(notificationMock.wasEmailSentTo('manager@company.com')).toBe(true);
  });

  it('le mock doit compter le nombre exact d\'emails envoyés', async () => {
    await notificationMock.sendEmail('rh@company.com', 'Sujet 1', 'Corps 1');
    await notificationMock.sendEmail('manager@company.com', 'Sujet 2', 'Corps 2');

    expect(notificationMock.getEmailsSentCount()).toBe(2);
  });

  it('le mock doit indiquer qu\'aucun email n\'a été envoyé après reset', async () => {
    await notificationMock.sendEmail('rh@company.com', 'Sujet', 'Corps');
    notificationMock.reset();

    expect(notificationMock.getEmailsSentCount()).toBe(0);
    expect(notificationMock.wasEmailSentTo('rh@company.com')).toBe(false);
  });
});
