import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import type { DemanderCongeInput } from '@application/use-cases/DemanderCongeUseCase';
import type { ValiderCongeInput } from '@application/use-cases/ValiderCongeUseCase';
import type { CalculerJoursDisponiblesInput } from '@application/use-cases/CalculerJoursDisponiblesUseCase';
import { DemanderCongeUseCase } from '@application/use-cases/DemanderCongeUseCase';
import { ValiderCongeUseCase } from '@application/use-cases/ValiderCongeUseCase';
import { CalculerJoursDisponiblesUseCase } from '@application/use-cases/CalculerJoursDisponiblesUseCase';

@Controller('conges')
export class CongeController {
  constructor(
    private demanderCongeUseCase: DemanderCongeUseCase,
    private validerCongeUseCase: ValiderCongeUseCase,
    private calculerJoursUseCase: CalculerJoursDisponiblesUseCase
  ) {}

  @Post()
  async demanderConge(@Body() input: DemanderCongeInput) {
    return this.demanderCongeUseCase.execute(input);
  }

  @Get(':id')
  async obtenirConge(@Param('id') id: string) {
    return { message: 'Congé récupéré', congeId: id };
  }

  @Patch(':id/valider')
  async validerConge(
    @Param('id') id: string,
    @Body() input: ValiderCongeInput
  ) {
    return this.validerCongeUseCase.execute({
      ...input,
      congeId: id,
    });
  }

  @Get('employee/:employeeId/disponible')
  async calculerJoursDisponibles(
    @Param('employeeId') employeeId: string,
    @Body() input: CalculerJoursDisponiblesInput
  ) {
    return this.calculerJoursUseCase.execute({
      ...input,
      employeeId,
    });
  }
}
