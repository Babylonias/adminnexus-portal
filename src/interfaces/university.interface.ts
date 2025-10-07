export interface IUniversity {
    id: string; // UUID
    name: string;
    slug: string;
    description?: string;
    address?: string;
    lng?: string | number | null;
    lat?: string | number | null;
    created_at?: string;
    updated_at?: string;
  }