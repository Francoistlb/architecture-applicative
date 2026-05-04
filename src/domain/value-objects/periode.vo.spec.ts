import { Periode } from './periode.vo';

describe('Periode (Value Object)', () => {

  // ─── Jours ouvrés ─────────────────────────────────────────────────────────

  it('devrait compter 5 jours ouvrés pour une semaine complète (lun→ven)', () => {
    // Lundi 01/06/2026 → Vendredi 05/06/2026
    const periode = new Periode(new Date('2026-06-01'), new Date('2026-06-05'));

    expect(periode.getNombreJoursOuvres()).toBe(5);
  });

  it('devrait exclure le week-end du décompte des jours ouvrés', () => {
    // Jeudi 04/06 → Mardi 09/06 : jeu + ven + lun + mar = 4 jours ouvrés
    const periode = new Periode(new Date('2026-06-04'), new Date('2026-06-09'));

    expect(periode.getNombreJoursOuvres()).toBe(4);
  });

  it('devrait retourner 1 jour ouvré pour un seul lundi', () => {
    const periode = new Periode(new Date('2026-06-01'), new Date('2026-06-01T23:59:59'));

    expect(periode.getNombreJoursOuvres()).toBe(1);
  });

  // ─── Jours calendaires ────────────────────────────────────────────────────

  it('devrait compter 3 jours calendaires du lundi au mercredi', () => {
    const periode = new Periode(new Date('2026-06-01'), new Date('2026-06-03'));

    expect(periode.getNombreJoursCalendaires()).toBe(3);
  });

  it('devrait compter les jours calendaires incluant le week-end', () => {
    // Vendredi 05/06 → Lundi 08/06 = ven + sam + dim + lun = 4 jours
    const periode = new Periode(new Date('2026-06-05'), new Date('2026-06-08'));

    expect(periode.getNombreJoursCalendaires()).toBe(4);
  });

  // ─── Chevauchements ───────────────────────────────────────────────────────

  it('devrait détecter deux périodes qui se chevauchent', () => {
    const p1 = new Periode(new Date('2026-06-01'), new Date('2026-06-10'));
    const p2 = new Periode(new Date('2026-06-08'), new Date('2026-06-15'));

    expect(p1.chevauche(p2)).toBe(true);
  });

  it('ne devrait pas détecter de chevauchement pour des périodes consécutives', () => {
    const p1 = new Periode(new Date('2026-06-01'), new Date('2026-06-05'));
    const p2 = new Periode(new Date('2026-06-06'), new Date('2026-06-10'));

    expect(p1.chevauche(p2)).toBe(false);
  });

  // ─── Validation ───────────────────────────────────────────────────────────

  it('devrait lever une erreur si dateFin est avant dateDebut', () => {
    expect(() => new Periode(new Date('2026-06-10'), new Date('2026-06-05')))
      .toThrow('strictement après');
  });

  it('devrait lever une erreur si dateFin est égale à dateDebut', () => {
    const date = new Date('2026-06-01');
    expect(() => new Periode(date, date)).toThrow();
  });
});
