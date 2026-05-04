/**
 * Mock : Service de notification pour vérifier les appels
 */
export class NotificationServiceMock {
  private sendEmailCalls: Array<{
    to: string;
    subject: string;
    body: string;
  }> = [];

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    this.sendEmailCalls.push({ to, subject, body });
    console.log(`📧 Email simulé envoyé à ${to}`);
  }

  /**
   * Vérifie qu'un email a été envoyé
   */
  wasEmailSentTo(email: string): boolean {
    return this.sendEmailCalls.some((call) => call.to === email);
  }

  /**
   * Compte combien d'emails ont été envoyés
   */
  getEmailsSentCount(): number {
    return this.sendEmailCalls.length;
  }

  /**
   * Reset les appels (utile entre les tests)
   */
  reset(): void {
    this.sendEmailCalls = [];
  }
}
