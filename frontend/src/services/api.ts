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

// Interfaces de Categoria
export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  userId: string;
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  color?: string;
}

// Serviços de categorias
export const categoryService = {
  getAll: () => {
    return api.get<Category[]>('/categories');
  },
  getOne: (id: string) => {
    return api.get<Category>(`/categories/${id}`);
  },
  create: (data: CreateCategoryDto) => {
    return api.post<Category>('/categories', data);
  },
  update: (id: string, data: UpdateCategoryDto) => {
    return api.patch<Category>(`/categories/${id}`, data);
  },
  delete: (id: string) => {
    return api.delete(`/categories/${id}`);
  },
};

// Serviços de tarefas
export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  isArchived: boolean;
  plannedDate?: string;
  completionDate?: string;
  userId: string;
  categoryId?: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  plannedDate?: string;
  isCompleted?: boolean;
  categoryId?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  plannedDate?: string;
  isCompleted?: boolean;
  categoryId?: string;
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
  getArchived: () => {
    return api.get<Task[]>('/tasks/archived');
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
  archive: (id: string) => {
    return api.patch<Task>(`/tasks/${id}/archive`);
  },
  unarchive: (id: string) => {
    return api.patch<Task>(`/tasks/${id}/unarchive`);
  },
  getMetrics: () => {
    return api.get<TaskMetrics>('/tasks/metrics');
  },
};

export default api;
