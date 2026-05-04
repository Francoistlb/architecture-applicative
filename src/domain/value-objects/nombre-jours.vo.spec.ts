import { NombreJours } from './nombre-jours.vo';

describe('NombreJours (Value Object)', () => {

  // ─── Création ─────────────────────────────────────────────────────────────

  it('devrait créer un NombreJours valide', () => {
    const nj = new NombreJours(5);

    expect(nj.getValue()).toBe(5);
  });

  it('devrait accepter une demi-journée (0.5)', () => {
    const nj = new NombreJours(0.5);

    expect(nj.getValue()).toBe(0.5);
  });

  it('devrait lever une erreur pour une valeur négative', () => {
    expect(() => new NombreJours(-1)).toThrow('négatif');
  });

  it('devrait lever une erreur pour une valeur supérieure à 365', () => {
    expect(() => new NombreJours(366)).toThrow('365');
  });

  // ─── Opérations ───────────────────────────────────────────────────────────

  it('devrait additionner deux NombreJours', () => {
    const a = new NombreJours(3);
    const b = new NombreJours(2);

    expect(a.add(b).getValue()).toBe(5);
  });

  it('devrait soustraire deux NombreJours', () => {
    const a = new NombreJours(10);
    const b = new NombreJours(4);

    expect(a.subtract(b).getValue()).toBe(6);
  });

  it('devrait être immutable : add retourne un nouvel objet', () => {
    const a = new NombreJours(3);
    const b = new NombreJours(2);
    const c = a.add(b);

    expect(a.getValue()).toBe(3); // a inchangé
    expect(c.getValue()).toBe(5);
  });

  it('devrait comparer isGreaterOrEqual correctement', () => {
    const a = new NombreJours(5);
    const b = new NombreJours(3);

    expect(a.isGreaterOrEqual(b)).toBe(true);
    expect(b.isGreaterOrEqual(a)).toBe(false);
  });
});
