export interface AuthRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    email: string;
    created_at?: string;
    updated_at?: string;
}

export interface AuthResponse {
    user: User;
    accces_token: string;
    expires_in: number;
    token_type: string;
    refresh_token: string;
    expires_in_refresh: number;
}