import { Conge, TypeConge, StatutConge } from './conge.entity';

const makeConge = (overrides: Partial<ConstructorParameters<typeof Conge>[0]> = {}) =>
  new Conge({
    id: 'conge-test',
    type: TypeConge.CONGE_PAYEE,
    dateDebut: new Date('2026-07-01'),
    dateFin: new Date('2026-07-05'),
    nombreJour: 4,
    employeeId: 'emp-001',
    ...overrides,
  });

describe('Conge (Entité)', () => {

  // ─── Cycle de vie ─────────────────────────────────────────────────────────

  it('devrait démarrer au statut EN_ATTENTE', () => {
    const conge = makeConge();

    expect(conge.getStatut()).toBe(StatutConge.EN_ATTENTE);
  });

  it('devrait passer à APPROUVE après approbation', () => {
    const conge = makeConge();
    conge.approuver();

    expect(conge.getStatut()).toBe(StatutConge.APPROUVE);
    expect(conge.isApprouve()).toBe(true);
  });

  it('devrait passer à REJETEE après rejet', () => {
    const conge = makeConge();
    conge.rejeter();

    expect(conge.getStatut()).toBe(StatutConge.REJETEE);
  });

  it('devrait passer à ANNULEE si annulé depuis EN_ATTENTE', () => {
    const conge = makeConge();
    conge.annuler();

    expect(conge.getStatut()).toBe(StatutConge.ANNULEE);
  });

  it('devrait passer à ANNULEE si annulé depuis APPROUVE', () => {
    const conge = makeConge();
    conge.approuver();
    conge.annuler();

    expect(conge.getStatut()).toBe(StatutConge.ANNULEE);
  });

  // ─── Transitions invalides ────────────────────────────────────────────────

  it('devrait lever une erreur si on approuve un congé déjà approuvé', () => {
    const conge = makeConge();
    conge.approuver();

    expect(() => conge.approuver()).toThrow('Impossible d\'approuver');
  });

  it('devrait lever une erreur si on rejette un congé déjà rejeté', () => {
    const conge = makeConge();
    conge.rejeter();

    expect(() => conge.rejeter()).toThrow('Impossible de rejeter');
  });

  it('devrait lever une erreur si on annule un congé déjà annulé', () => {
    const conge = makeConge();
    conge.annuler();

    expect(() => conge.annuler()).toThrow('Impossible d\'annuler');
  });

  // ─── Méthode isUrgenceFamiliale ───────────────────────────────────────────

  it('devrait identifier une urgence familiale', () => {
    const conge = makeConge({ type: TypeConge.URGENCE_FAMILIALE });

    expect(conge.isUrgenceFamiliale()).toBe(true);
  });

  it('ne devrait pas être une urgence familiale pour un congé payé', () => {
    const conge = makeConge({ type: TypeConge.CONGE_PAYEE });

    expect(conge.isUrgenceFamiliale()).toBe(false);
  });
});
