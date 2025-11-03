import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { taskService, Task, CreateTaskDto, TaskMetrics } from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<TaskMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    plannedDate: '',
    isCompleted: false,
  });

  useEffect(() => {
    loadTasks();
    loadMetrics();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await taskService.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await taskService.getMetrics();
      setMetrics(response.data);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, formData);
      } else {
        await taskService.create(formData);
      }
      setShowModal(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', plannedDate: '', isCompleted: false });
      loadTasks();
      loadMetrics();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao salvar tarefa');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      plannedDate: task.plannedDate || '',
      isCompleted: task.isCompleted,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await taskService.delete(id);
        loadTasks();
        loadMetrics();
      } catch (error) {
        alert('Erro ao excluir tarefa');
      }
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await taskService.update(task.id, { isCompleted: !task.isCompleted });
      loadTasks();
      loadMetrics();
    } catch (error) {
      alert('Erro ao atualizar tarefa');
    }
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '', plannedDate: '', isCompleted: false });
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Minhas Tarefas
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.email}
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Alternar tema"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Tarefas</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalTasks}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Taxa de Conclusão</h3>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {metrics.completionRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Concluídas no Prazo</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.onTimeRate.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {/* Add Task Button */}
        <div className="mb-6">
          <button
            onClick={openNewTaskModal}
            className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
          >
            + Nova Tarefa
          </button>
        </div>

        {/* Tasks List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma tarefa encontrada. Crie sua primeira tarefa!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {tasks.map((task) => (
                <li key={task.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => handleToggleComplete(task)}
                        className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-medium ${
                            task.isCompleted
                              ? 'line-through text-gray-500 dark:text-gray-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {task.description}
                          </p>
                        )}
                        <div className="mt-2 flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                          {task.plannedDate && (
                            <span>📅 Prazo: {new Date(task.plannedDate).toLocaleDateString('pt-BR')}</span>
                          )}
                          {task.completionDate && (
                            <span>✅ Concluída: {new Date(task.completionDate).toLocaleDateString('pt-BR')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(task)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Planejada
                </label>
                <input
                  type="date"
                  value={formData.plannedDate}
                  onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                    setFormData({ title: '', description: '', plannedDate: '', isCompleted: false });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
