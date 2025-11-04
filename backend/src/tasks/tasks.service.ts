import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    try {
      const task = this.taskRepository.create({
        ...createTaskDto,
        userId,
      });

      return await this.taskRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar tarefa');
    }
  }

  async findAll(userId: string, includeArchived = false): Promise<Task[]> {
    const whereCondition: any = { userId };
    
    if (!includeArchived) {
      whereCondition.isArchived = false;
    }

    return await this.taskRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      relations: ['category'],
    });
  }

  async findArchived(userId: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { userId, isArchived: true },
      order: { completionDate: 'DESC' },
      relations: ['category'],
    });
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);

    // Cria objeto para atualização, convertendo null para undefined
    const updateData: any = { ...updateTaskDto };

    // Se a tarefa está sendo marcada como concluída e ainda não tem data de conclusão
    if (updateTaskDto.isCompleted && !task.isCompleted) {
      updateData.completionDate = new Date().toISOString();
      updateData.isArchived = true; // Arquiva automaticamente quando completa
    }

    // Se a tarefa está sendo desmarcada como concluída, remove a data de conclusão
    if (updateTaskDto.isCompleted === false) {
      updateData.completionDate = null;
      updateData.isArchived = false; // Desarquiva quando desmarca
    }

    // Converte null para undefined para compatibilidade com TypeORM
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === null) {
        delete updateData[key];
      }
    });

    await this.taskRepository.update(id, updateData);
    return this.findOne(id, userId);
  }

  async archive(id: string, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.update(id, { isArchived: true });
    return this.findOne(id, userId);
  }

  async unarchive(id: string, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.update(id, { isArchived: false, isCompleted: false });
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);
  }

  async getTaskMetrics(userId: string) {
    const tasks = await this.findAll(userId);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;

    const tasksWithPlannedDate = tasks.filter((task) => task.plannedDate);
    const completedOnTime = tasksWithPlannedDate.filter(
      (task) =>
        task.isCompleted &&
        task.completionDate &&
        new Date(task.completionDate) <= new Date(task.plannedDate),
    ).length;

    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const onTimeRate =
      tasksWithPlannedDate.length > 0
        ? (completedOnTime / tasksWithPlannedDate.length) * 100
        : 0;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: Math.round(completionRate * 100) / 100,
      completedOnTime,
      onTimeRate: Math.round(onTimeRate * 100) / 100,
    };
  }
}
