import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService, Task } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  FiArchive,
  FiCornerUpLeft,
  FiTrash2,
  FiArrowLeft,
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiFolder,
} from 'react-icons/fi';

export default function ArchivedTasks() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  const fetchArchivedTasks = async () => {
    try {
      const response = await taskService.getArchived();
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas arquivadas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnarchive = async (id: string) => {
    try {
      await taskService.unarchive(id);
      fetchArchivedTasks();
    } catch (error) {
      alert('Erro ao recuperar tarefa');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente excluir esta tarefa permanentemente?')) {
      try {
        await taskService.delete(id);
        fetchArchivedTasks();
      } catch (error) {
        alert('Erro ao excluir tarefa');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <FiArchive className="w-6 h-6" /> Tarefas Concluídas
            </h1>
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
                onClick={() => navigate('/dashboard')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FiArrowLeft className="w-4 h-4" /> Dashboard
              </button>
              <button
                onClick={() => navigate('/categories')}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
              >
                <FiFolder className="w-4 h-4" /> Categorias
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Total de tarefas concluídas: <span className="font-bold">{tasks.length}</span>
          </p>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    {task.category && (
                      <span
                        className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                        style={{ backgroundColor: task.category.color || '#3B82F6' }}
                      >
                        {task.category.name}
                      </span>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}

                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {task.completionDate && (
                      <p>
                        <span className="font-semibold">Concluída em:</span>{' '}
                        {formatDate(task.completionDate)}
                      </p>
                    )}
                    {task.plannedDate && (
                      <p>
                        <span className="font-semibold">Data planejada:</span>{' '}
                        {formatDate(task.plannedDate)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleUnarchive(task.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap flex items-center gap-2"
                  >
                    <FiCornerUpLeft className="w-4 h-4" /> Recuperar
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <FiTrash2 className="w-4 h-4" /> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="text-xl">Nenhuma tarefa concluída ainda.</p>
            <p className="mt-2">As tarefas marcadas como concluídas aparecerão aqui!</p>
          </div>
        )}
      </main>
    </div>
  );
}
