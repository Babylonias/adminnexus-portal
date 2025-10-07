// src/api/AuthService.ts
import ApiService from './api.service';
import { AuthResponse} from '../interfaces/auth.interface';
import { saveToken, removeToken } from '../utils/token.util';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

class AuthService extends ApiService {
  constructor() {
    super();
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/login', credentials);
    if (response.data.access_token) saveToken(response.data.access_token);
    return response.data;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/register', data);
    return response.data;
  }

  logout(): void {
    removeToken();
  }
}

export default new AuthService();
