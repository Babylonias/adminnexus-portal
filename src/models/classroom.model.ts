import { University } from "./university.model";

export class Classroom {
    id: string;
    name: string;
    slug: string;
    lng?: string | number | null;
    lat?: string | number | null;
    capacity?: number;
    equipment?: string[];
    status?: "active" | "maintenance" | "draft";
    description?: string;
    created_at?: string;
    updated_at?: string;
    main_image?: string;
    annexes?: string[];
    universityId?: string;
    university?: University;
}