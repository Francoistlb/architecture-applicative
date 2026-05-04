/**
 * Value Object représentant une période de temps
 * Immutable - valide les règles métier dès la création
 */
export class Periode {
  private readonly dateDebut: Date;
  private readonly dateFin: Date;

  constructor(dateDebut: Date, dateFin: Date) {
    this.validateDates(dateDebut, dateFin);
    this.dateDebut = new Date(dateDebut);
    this.dateFin = new Date(dateFin);
  }

  /**
   * Retourne le nombre de jours calendaires (inclus les we et jours fériés)
   */
  getNombreJoursCalendaires(): number {
    const diffTime = this.dateFin.getTime() - this.dateDebut.getTime();
    // +1 pour inclure le jour de fin
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  /**
   * Retourne le nombre de jours ouvrés (lun-ven uniquement)
   */
  getNombreJoursOuvres(): number {
    let count = 0;
    const current = new Date(this.dateDebut);

    while (current <= this.dateFin) {
      const dayOfWeek = current.getDay();
      // dayOfWeek: 0=dimanche, 1=lundi, ..., 6=samedi
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  /**
   * Vérifie si une date donnée est dans la période
   */
  contient(date: Date): boolean {
    return date >= this.dateDebut && date <= this.dateFin;
  }

  /**
   * Vérifie si la période chevauche une autre période
   */
  chevauche(autre: Periode): boolean {
    return (
      this.dateDebut <= autre.dateFin &&
      this.dateFin >= autre.dateDebut
    );
  }

  getDateDebut(): Date {
    return new Date(this.dateDebut);
  }

  getDateFin(): Date {
    return new Date(this.dateFin);
  }

  /**
   * Égalité: deux périodes sont égales si elles ont les mêmes dates
   */
  equals(autre: Periode): boolean {
    return (
      this.dateDebut.getTime() === autre.dateDebut.getTime() &&
      this.dateFin.getTime() === autre.dateFin.getTime()
    );
  }

  private validateDates(dateDebut: Date, dateFin: Date): void {
    if (dateFin <= dateDebut) {
      throw new Error(
        'La date de fin doit être strictement après la date de début'
      );
    }
  }
}