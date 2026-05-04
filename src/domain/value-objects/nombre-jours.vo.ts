/**
 * Value Object représentant un nombre de jours
 * Valide les règles métier : pas de nombre négatif, limites raisonnables
 */
export class NombreJours {
  private readonly valeur: number;

  constructor(valeur: number) {
    this.validate(valeur);
    this.valeur = Math.round(valeur * 2) / 2; // Arrondir à 0.5
  }

  /**
   * Retourne la valeur en nombre entier
   */
  toInt(): number {
    return Math.floor(this.valeur);
  }

  /**
   * Retourne la valeur exacte (peut incluire 0.5)
   */
  getValue(): number {
    return this.valeur;
  }

  /**
   * Additionne deux NombreJours
   */
  add(autre: NombreJours): NombreJours {
    return new NombreJours(this.valeur + autre.valeur);
  }

  /**
   * Soustrait deux NombreJours
   */
  subtract(autre: NombreJours): NombreJours {
    return new NombreJours(this.valeur - autre.valeur);
  }

  /**
   * Compare: retourne true si plus grand ou égal
   */
  isGreaterOrEqual(autre: NombreJours): boolean {
    return this.valeur >= autre.valeur;
  }

  /**
   * Compare: retourne true si plus petit ou égal
   */
  isLessOrEqual(autre: NombreJours): boolean {
    return this.valeur <= autre.valeur;
  }

  /**
   * Égalité
   */
  equals(autre: NombreJours): boolean {
    return this.valeur === autre.valeur;
  }

  /**
   * Représentation lisible
   */
  toString(): string {
    return `${this.valeur} jour(s)`;
  }

  private validate(valeur: number): void {
    if (valeur < 0) {
      throw new Error(`Le nombre de jours ne peut pas être négatif: ${valeur}`);
    }
    if (valeur > 365) {
      throw new Error(
        `Le nombre de jours ne peut pas dépasser 365: ${valeur}`
      );
    }
  }
}