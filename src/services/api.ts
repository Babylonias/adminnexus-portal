const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7011';

// Fonction utilitaire pour valider les UUID
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Fonction pour générer un UUID v4 simple (pour les tests uniquement)
const generateTempUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

interface University {
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

interface Classroom {
  id: string; // UUID
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
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug

      // Adapter la réponse au format attendu
      return {
        data: data,
        success: true
      };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Récupérer toutes les universités
  async getUniversities(): Promise<University[]> {
    try {
      const response = await this.request<any>('/api/universities');

      // Votre API retourne {universities: [...]}
      const universitiesData = response.data?.universities || [];

      console.log('Raw universities data:', universitiesData); // Debug

      // Traiter les données - utiliser l'ID de la base ou générer un UUID temporaire
      return universitiesData.map((uni: any) => ({
        id: uni.id || generateTempUUID(), // Utiliser l'UUID de la base ou générer un temporaire
        name: uni.name,
        slug: uni.slug,
        description: uni.description,
        address: uni.address,
        lat: uni.lat ? parseFloat(uni.lat) : undefined,
        lng: uni.lng ? parseFloat(uni.lng) : undefined,
        created_at: uni.created_at,
        updated_at: uni.updated_at
      }));
    } catch (error) {
      console.error('Failed to fetch universities:', error);
      // Retourner des données de fallback en cas d'erreur
      return [
        { id: "01234567-89ab-cdef-0123-456789abcdef", name: "Université Paris Tech", slug: "universite-paris-tech" },
        { id: "11234567-89ab-cdef-0123-456789abcdef", name: "Sorbonne Université", slug: "sorbonne-universite" },
        { id: "21234567-89ab-cdef-0123-456789abcdef", name: "Université Lyon 1", slug: "universite-lyon-1" }
      ];
    }
  }

  // Récupérer une université par ID
  async getUniversity(id: string): Promise<University | null> {
    try {
      const response = await this.request<University>(`/api/universities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch university:', error);
      return null;
    }
  }

  // Créer un amphithéâtre
  async createAmphitheater(data: FormData): Promise<any> {
    try {
      const response = await this.request('/api/classrooms', {
        method: 'POST',
        body: data,
        headers: {
          // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
        },
      });
      return response;
    } catch (error) {
      console.error('Failed to create amphitheater:', error);
      throw error;
    }
  }

  // Mettre à jour un amphithéâtre
  async updateAmphitheater(id: string, data: FormData): Promise<any> {
    try {
      const response = await this.request(`/api/classrooms/${id}`, {
        method: 'PUT',
        body: data,
        headers: {
          // Ne pas définir Content-Type pour FormData
        },
      });
      return response;
    } catch (error) {
      console.error('Failed to update amphitheater:', error);
      throw error;
    }
  }

  // Récupérer les amphithéâtres d'une université
  async getUniversityClassrooms(universityId: string): Promise<Classroom[]> {
    try {
      const response = await this.request<any>(`/api/universities/${universityId}/classrooms`);
      console.log('University classrooms response:', response); // Debug

      // Traiter les données selon la structure de votre API
      let classrooms = response.data?.classrooms || response.data || [];

      // Si c'est un objet avec une propriété classrooms
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        classrooms = response.data.classrooms || [];
      }

      // Normaliser les données
      return classrooms.map((classroom: any) => ({
        id: classroom.id,
        name: classroom.name,
        slug: classroom.slug,
        lng: classroom.lng,
        lat: classroom.lat,
        capacity: classroom.capacity ? parseInt(classroom.capacity) : 0,
        equipment: classroom.equipment || [],
        status: classroom.status || 'active',
        description: classroom.description,
        created_at: classroom.created_at,
        updated_at: classroom.updated_at,
        main_image: classroom.main_image,
        annexes: classroom.annexes || []
      }));
    } catch (error) {
      console.error('Failed to fetch university classrooms:', error);
      return [];
    }
  }
}

export const apiService = new ApiService();
export { isValidUUID, generateTempUUID };
export type { University, Classroom, ApiResponse };