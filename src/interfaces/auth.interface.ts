import { User } from "@/interfaces/user.interface";

export interface AuthResponse {
    user: User;
    access_token: string;
    token_type: string;
    expires_in: string;
    refresh_token: string;
    expires_in_refresh: string;
}