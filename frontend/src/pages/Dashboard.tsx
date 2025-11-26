import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { taskService, categoryService, Task, Category, CreateTaskDto, TaskMetrics } from '../services/api';
import {
  FiCheckSquare,
  FiSquare,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSun,
  FiMoon,
  FiFolder,
  FiArchive,
  FiUser,
  FiLogOut,
} from 'react-icons/fi';

interface KanbanColumn {
  category: Category | null;
  tasks: Task[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [metrics, setMetrics] = useState<TaskMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    plannedDate: '',
    isCompleted: false,
    categoryId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksResponse, categoriesResponse, metricsResponse] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll(),
        taskService.getMetrics(),
      ]);

      const tasks = tasksResponse.data;
      const cats = categoriesResponse.data;
      setCategories(cats);
      setMetrics(metricsResponse.data);

      // Organiza tarefas em colunas Kanban
      const kanbanColumns: KanbanColumn[] = [];

      // Adiciona coluna "Sem Categoria"
      kanbanColumns.push({
        category: null,
        tasks: tasks.filter(task => !task.categoryId),
      });

      // Adiciona uma coluna para cada categoria
      cats.forEach(category => {
        kanbanColumns.push({
          category,
          tasks: tasks.filter(task => task.categoryId === category.id),
        });
      });

      setColumns(kanbanColumns);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        categoryId: formData.categoryId || undefined,
      };

      if (editingTask) {
        await taskService.update(editingTask.id, dataToSend);
      } else {
        await taskService.create(dataToSend);
      }
      loadData();
      handleCloseModal();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao salvar tarefa');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await taskService.update(task.id, {
        isCompleted: !task.isCompleted,
      });
      loadData();
    } catch (error) {
      alert('Erro ao atualizar tarefa');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente excluir esta tarefa?')) {
      try {
        await taskService.delete(id);
        loadData();
      } catch (error) {
        alert('Erro ao excluir tarefa');
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      plannedDate: task.plannedDate || '',
      isCompleted: task.isCompleted,
      categoryId: task.categoryId || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      plannedDate: '',
      isCompleted: false,
      categoryId: '',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <FiCheckSquare className="w-6 h-6" />
                To-Do List - {user?.email}
              </h1>
              {metrics && (
                <div className={`mt-2 flex gap-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Total: <strong>{metrics.totalTasks}</strong></span>
                  <span>Concluídas: <strong>{metrics.completedTasks}</strong></span>
                  <span>Pendentes: <strong>{metrics.pendingTasks}</strong></span>
                  <span>Taxa de conclusão: <strong>{metrics.completionRate.toFixed(1)}%</strong></span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleTheme}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                {isDark ? <><FiSun className="w-4 h-4" /> Claro</> : <><FiMoon className="w-4 h-4" /> Escuro</>}
              </button>
              <button
                onClick={() => navigate('/categories')}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
              >
                <FiFolder className="w-4 h-4" /> Categorias
              </button>
              <button
                onClick={() => navigate('/archived')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FiArchive className="w-4 h-4" /> Arquivadas
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
              >
                <FiUser className="w-4 h-4" /> Perfil
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FiLogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" /> Nova Tarefa
          </button>
        </div>

        {/* Kanban Columns */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div
              key={column.category?.id || 'uncategorized'}
              className={`flex-shrink-0 w-80 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4`}
            >
              {/* Column Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {column.category ? (
                    <>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: column.category.color || '#3B82F6' }}
                      ></div>
                      <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {column.category.name}
                      </h2>
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                      <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Sem Categoria
                      </h2>
                    </>
                  )}
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {column.tasks.length} {column.tasks.length === 1 ? 'tarefa' : 'tarefas'}
                </p>
              </div>

              {/* Tasks in Column */}
              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className="mt-1 cursor-pointer text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        {task.isCompleted ? (
                          <FiCheckSquare className="h-5 w-5" />
                        ) : (
                          <FiSquare className="h-5 w-5" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold ${
                            task.isCompleted
                              ? isDark
                                ? 'text-gray-500 line-through'
                                : 'text-gray-400 line-through'
                              : isDark
                              ? 'text-white'
                              : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        )}
                        {task.plannedDate && (
                          <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            {formatDate(task.plannedDate)}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEdit(task)}
                            className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                          >
                            <FiEdit2 className="w-3 h-3" /> Editar
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                          >
                            <FiTrash2 className="w-3 h-3" /> Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {column.tasks.length === 0 && (
                  <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <p className="text-sm">Nenhuma tarefa</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {columns.length === 0 && (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className="text-xl">Crie categorias e tarefas para começar!</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className={`block mb-2 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>

              <div className="mb-4">
                <label className={`block mb-2 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className={`block mb-2 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Categoria
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Sem categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className={`block mb-2 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Data Planejada
                </label>
                <input
                  type="date"
                  value={formData.plannedDate}
                  onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    isDark
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingTask ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
