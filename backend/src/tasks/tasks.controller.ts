import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tasks')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova tarefa' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas ativas do usuário (não arquivadas)' })
  @ApiResponse({ status: 200, description: 'Lista de tarefas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user.userId, false);
  }

  @Get('archived')
  @ApiOperation({ summary: 'Listar todas as tarefas arquivadas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de tarefas arquivadas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findArchived(@Request() req) {
    return this.tasksService.findArchived(req.user.userId);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Obter métricas das tarefas' })
  @ApiResponse({ status: 200, description: 'Métricas de produtividade' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  getMetrics(@Request() req) {
    return this.tasksService.getTaskMetrics(req.user.userId);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Arquivar uma tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa arquivada com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  archive(@Param('id') id: string, @Request() req) {
    return this.tasksService.archive(id, req.user.userId);
  }

  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Desarquivar uma tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa desarquivada com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  unarchive(@Param('id') id: string, @Request() req) {
    return this.tasksService.unarchive(id, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tarefa por ID' })
  @ApiResponse({ status: 200, description: 'Tarefa encontrada' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tarefa' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user.userId);
  }
}
