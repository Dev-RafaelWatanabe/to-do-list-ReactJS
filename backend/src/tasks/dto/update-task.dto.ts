import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description: 'Indica se a tarefa está concluída',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isCompleted deve ser um valor booleano' })
  isCompleted?: boolean;

  @ApiProperty({
    description: 'Data de conclusão da tarefa (preenchida automaticamente ao marcar como concluída)',
    example: '2025-11-03T12:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'A data de conclusão deve ser uma data válida' })
  completionDate?: string | null;
}
