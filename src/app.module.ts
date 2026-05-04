import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CongeController } from '@infrastructure/http/controllers/conge.controller';
import { PrismaService } from '@infrastructure/persistence/prisma/prisma.service';
import { CongePrismaRepository } from '@infrastructure/persistence/repositories/conge.prisma-repository';
import { CONGE_REPOSITORY } from '@domain/interfaces/repositories/conge.repository';
import { DemanderCongeUseCase } from '@application/use-cases/DemanderCongeUseCase';
import { ValiderCongeUseCase } from '@application/use-cases/ValiderCongeUseCase';
import { CalculerJoursDisponiblesUseCase } from '@application/use-cases/CalculerJoursDisponiblesUseCase';
import { ValidateCongeChainUseCase } from '@application/use-cases/ValidateCongeChainUseCase';

@Module({
  imports: [],
  controllers: [AppController, CongeController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: CONGE_REPOSITORY,
      useClass: CongePrismaRepository,
    },
    DemanderCongeUseCase,
    ValiderCongeUseCase,
    CalculerJoursDisponiblesUseCase,
    ValidateCongeChainUseCase,
  ],
})
export class AppModule {}
