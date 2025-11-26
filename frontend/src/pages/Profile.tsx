import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { taskService } from '../services/api';
import { 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiCheckCircle, 
  FiClock,
  FiArchive,
  FiArrowLeft,
  FiSun,
  FiMoon
} from 'react-icons/fi';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  archivedTasks: number;
  pendingTasks: number;
}

const THEME_COLORS = [
  { name: 'Azul', primary: '#3B82F6', secondary: '#2563EB' },
  { name: 'Verde', primary: '#10B981', secondary: '#059669' },
  { name: 'Roxo', primary: '#8B5CF6', secondary: '#7C3AED' },
  { name: 'Rosa', primary: '#EC4899', secondary: '#DB2777' },
  { name: 'Laranja', primary: '#F97316', secondary: '#EA580C' },
  { name: 'Ciano', primary: '#06B6D4', secondary: '#0891B2' },
  { name: 'Vermelho', primary: '#EF4444', secondary: '#DC2626' },
  { name: 'Índigo', primary: '#6366F1', secondary: '#4F46E5' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, themeColor, setThemeColor } = useTheme();
  const isDark = theme === 'dark';

  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    archivedTasks: 0,
    pendingTasks: 0,
  });
  const [selectedColor, setSelectedColor] = useState(THEME_COLORS[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadThemeColor();
  }, [themeColor]);

  const loadStats = async () => {
    try {
      const [tasksResponse, archivedResponse] = await Promise.all([
        taskService.getAll(),
        taskService.getArchived(),
      ]);

      const tasks = tasksResponse.data;
      const archived = archivedResponse.data;

      setStats({
        totalTasks: tasks.length + archived.length,
        completedTasks: tasks.filter(t => t.isCompleted).length + archived.length,
        archivedTasks: archived.length,
        pendingTasks: tasks.filter(t => !t.isCompleted).length,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadThemeColor = () => {
    const color = THEME_COLORS.find(c => c.primary === themeColor);
    if (color) setSelectedColor(color);
  };

  const handleColorChange = (color: typeof THEME_COLORS[0]) => {
    setSelectedColor(color);
    setThemeColor(color.primary);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      <header className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Meu Perfil
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-8`}>
          <div className="flex items-center gap-6 mb-6">
            <div className={`w-20 h-20 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
              <FiUser className={`w-10 h-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                {user?.email?.split('@')[0]}
              </h2>
              <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <FiMail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalTasks}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Total de Tarefas
              </p>
            </div>

            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <FiCheckCircle className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.completedTasks}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Concluídas
              </p>
            </div>

            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <FiClock className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.pendingTasks}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Pendentes
              </p>
            </div>

            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <FiArchive className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.archivedTasks}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Arquivadas
              </p>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-8`}>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Preferências de Tema
          </h3>

          {/* Dark/Light Mode */}
          <div className="mb-8">
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              Modo de Exibição
            </label>
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
            >
              {isDark ? (
                <>
                  <FiMoon className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Modo Escuro</span>
                </>
              ) : (
                <>
                  <FiSun className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-900 font-medium">Modo Claro</span>
                </>
              )}
            </button>
          </div>

          {/* Color Picker */}
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              Cor do Tema
            </label>
            <div className="grid grid-cols-4 gap-3">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color)}
                  className={`relative group`}
                >
                  <div
                    className={`w-full aspect-square rounded-xl transition-all ${
                      selectedColor.name === color.name
                        ? 'ring-4 ring-offset-2 ' + (isDark ? 'ring-offset-gray-800' : 'ring-offset-white')
                        : 'hover:scale-105'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${color.primary} 0%, ${color.secondary} 100%)`,
                      ...(selectedColor.name === color.name && { outlineColor: color.primary }),
                    }}
                  ></div>
                  <p className={`text-xs mt-2 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {color.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8`}>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className={`w-full px-4 py-3 rounded-xl ${
                isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              } transition-colors text-left font-medium`}
            >
              Ver Minhas Tarefas
            </button>
            <button
              onClick={() => navigate('/categories')}
              className={`w-full px-4 py-3 rounded-xl ${
                isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              } transition-colors text-left font-medium`}
            >
              Gerenciar Categorias
            </button>
            <button
              onClick={() => navigate('/archived')}
              className={`w-full px-4 py-3 rounded-xl ${
                isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              } transition-colors text-left font-medium`}
            >
              Ver Tarefas Arquivadas
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors text-left font-medium"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
