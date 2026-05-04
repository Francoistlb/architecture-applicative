import { Injectable } from '@nestjs/common';
import { CongeRepository } from '@domain/interfaces/repositories/conge.repository';
import { Conge, TypeConge, StatutConge } from '@domain/entities/conge.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CongePrismaRepository implements CongeRepository {
  constructor(private prisma: PrismaService) {}

  async save(conge: Conge): Promise<void> {
    await this.prisma.conge.create({
      data: {
        type: conge.getType(),
        dateDebut: conge.getDateDebut(),
        dateFin: conge.getDateFin(),
        nombreJour: conge.getNombreJour(),
        motif: conge.getMotif(),
        statut: conge.getStatut(),
        employeeId: conge.getEmployeeId(),
      },
    });
  }

  async findById(id: string): Promise<Conge | null> {
    const congeData = await this.prisma.conge.findUnique({
      where: { id },
    });

    if (!congeData) return null;
    return this.mapToDomain(congeData);
  }

  async findByEmployeeId(employeeId: string): Promise<Conge[]> {
    const congesData = await this.prisma.conge.findMany({
      where: { employeeId },
    });

    return congesData.map((data) => this.mapToDomain(data));
  }

  async update(conge: Conge): Promise<void> {
    await this.prisma.conge.update({
      where: { id: conge.getId() },
      data: {
        statut: conge.getStatut(),
        nombreJour: conge.getNombreJour(),
        motif: conge.getMotif(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.conge.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Conge[]> {
    const congesData = await this.prisma.conge.findMany();
    return congesData.map((data) => this.mapToDomain(data));
  }

  async findPendingByEmployeeId(employeeId: string): Promise<Conge[]> {
    const congesData = await this.prisma.conge.findMany({
      where: {
        employeeId,
        statut: 'EN_ATTENTE',
      },
    });

    return congesData.map((data) => this.mapToDomain(data));
  }

  async findApprovedInPeriod(
    employeeId: string,
    dateDebut: Date,
    dateFin: Date
  ): Promise<Conge[]> {
    const congesData = await this.prisma.conge.findMany({
      where: {
        employeeId,
        statut: 'APPROUVE',
        dateDebut: { gte: dateDebut },
        dateFin: { lte: dateFin },
      },
    });

    return congesData.map((data) => this.mapToDomain(data));
  }

  private mapToDomain(data: any): Conge {
    return new Conge({
      id: data.id,
      type: data.type as TypeConge,
      dateDebut: data.dateDebut,
      dateFin: data.dateFin,
      nombreJour: data.nombreJour,
      motif: data.motif,
      statut: data.statut as StatutConge,
      employeeId: data.employeeId,
    });
  }
}
