import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Trabalho',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Tarefas relacionadas ao trabalho',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiProperty({
    description: 'Cor hexadecimal para o card Kanban',
    example: '#3B82F6',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;
}
