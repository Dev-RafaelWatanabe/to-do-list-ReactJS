import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Estudar NestJS',
  })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString({ message: 'O título deve ser um texto' })
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada da tarefa',
    example: 'Estudar documentação oficial do NestJS e criar exemplos práticos',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto' })
  description?: string;

  @ApiProperty({
    description: 'Indica se a tarefa está concluída',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isCompleted deve ser um valor booleano' })
  isCompleted?: boolean;

  @ApiProperty({
    description: 'Data planejada para conclusão da tarefa',
    example: '2025-11-10',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'A data planejada deve ser uma data válida' })
  plannedDate?: string;

  @ApiProperty({
    description: 'ID da categoria à qual a tarefa pertence',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'O ID da categoria deve ser um UUID válido' })
  categoryId?: string;
}
