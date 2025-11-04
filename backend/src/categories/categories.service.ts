import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: string,
  ): Promise<Category> {
    try {
      // Verifica se já existe uma categoria com o mesmo nome para este usuário
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: createCategoryDto.name, userId },
      });

      if (existingCategory) {
        throw new ConflictException(
          'Já existe uma categoria com este nome',
        );
      }

      const category = this.categoryRepository.create({
        ...createCategoryDto,
        userId,
      });

      return await this.categoryRepository.save(category);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar categoria');
    }
  }

  async findAll(userId: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
      relations: ['tasks'],
    });
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, userId },
      relations: ['tasks'],
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const category = await this.findOne(id, userId);

    // Verifica se o novo nome já existe (se estiver mudando o nome)
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name, userId },
      });

      if (existingCategory) {
        throw new ConflictException(
          'Já existe uma categoria com este nome',
        );
      }
    }

    const updateData: any = { ...updateCategoryDto };
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === null) {
        delete updateData[key];
      }
    });

    await this.categoryRepository.update(id, updateData);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.findOne(id, userId);
    
    // As tarefas associadas terão categoryId setado para null automaticamente
    // devido ao comportamento do TypeORM com relacionamentos nullable
    await this.categoryRepository.remove(category);
  }
}
