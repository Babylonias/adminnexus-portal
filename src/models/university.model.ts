export class University {
    id: string;
    name: string;
    slug: string;
    description?: string;
    address?: string;
    lng?: string | number | null;
    lat?: string | number | null;
    created_at?: Date;
    updated_at?: Date;
}