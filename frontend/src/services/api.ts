import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },
  register: (email: string, password: string) => {
    return api.post('/auth/register', { email, password });
  },
};

// Serviços de tarefas
export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  plannedDate?: string;
  completionDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  plannedDate?: string;
  isCompleted?: boolean;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  plannedDate?: string;
  isCompleted?: boolean;
}

export interface TaskMetrics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  completedOnTime: number;
  onTimeRate: number;
}

export const taskService = {
  getAll: () => {
    return api.get<Task[]>('/tasks');
  },
  getOne: (id: string) => {
    return api.get<Task>(`/tasks/${id}`);
  },
  create: (data: CreateTaskDto) => {
    return api.post<Task>('/tasks', data);
  },
  update: (id: string, data: UpdateTaskDto) => {
    return api.patch<Task>(`/tasks/${id}`, data);
  },
  delete: (id: string) => {
    return api.delete(`/tasks/${id}`);
  },
  getMetrics: () => {
    return api.get<TaskMetrics>('/tasks/metrics');
  },
};

export default api;
