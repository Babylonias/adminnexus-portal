import ApiService from './api.service';
import { User } from '@/interfaces/user.interface';

export class UserService extends ApiService {
  constructor() {
    super()
  }

  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    const response = await this.get<{ data: User[] }>('/users');
    return response.data.data;
  }

  // Récupérer un utilisateur par son ID
  async getUserById(id: number): Promise<User> {
    const response = await this.get<{ data: User }>(`/users/${id}`);
    return response.data.data;
  }

  // Créer un nouvel utilisateur
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await this.post<{ data: User }>('/users', userData);
    return response.data.data;
  }

  // Mettre à jour un utilisateur
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await this.put<{ data: User }>(`/users/${id}`, userData);
    return response.data.data;
  }

  // Supprimer un utilisateur
  async deleteUser(id: number): Promise<void> {
    await this.delete(`/users/${id}`);
  }

  // Mettre à jour le mot de passe de l'utilisateur
  async updatePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await this.post('/users/change-password', data);
  }

  // Récupérer le profil de l'utilisateur connecté
  async getProfile(): Promise<User> {
    const response = await this.get<{ data: User }>('/users/me');
    return response.data.data;
  }

  // Mettre à jour le profil de l'utilisateur connecté
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.put<{ data: User }>(`/users/me`, userData);
    return response.data.data;
  }
}

export default new UserService();