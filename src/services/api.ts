const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7011";

// Fonction utilitaire pour valider les UUID
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Fonction pour générer un UUID v4 simple (pour les tests uniquement)
const generateTempUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
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
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Ne pas ajouter Content-Type pour FormData
    const defaultHeaders: Record<string, string> = {};
    if (!(options.body instanceof FormData)) {
      defaultHeaders["Content-Type"] = "application/json";
    }
    defaultHeaders["Accept"] = "application/json";

    try {
      console.log("Making request to:", url); // Debug
      console.log("Request method:", options.method || "GET"); // Debug

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      console.log("Response status:", response.status); // Debug
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries()),
      ); // Debug

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", {
          status: response.status,
          statusText: response.statusText,
          url,
          method: options.method || "GET",
          errorText,
        });
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`,
        );
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug

      // Adapter la réponse au format attendu
      return {
        data: data,
        success: true,
        status: response.status,
      };
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Récupérer toutes les universités
  async getUniversities(): Promise<University[]> {
    try {
      const response = await this.request<{ universities: University[] }>(
        "/api/universities",
      );

      // Votre API retourne {universities: [...]}
      const universitiesData = response.data?.universities || [];

      console.log("Raw universities data:", universitiesData); // Debug

      // Traiter les données - utiliser l'ID de la base
      return universitiesData.map((uni: University) => ({
        id: uni.id, // Utiliser l'UUID de la base
        name: uni.name,
        slug: uni.slug,
        description: uni.description,
        address: uni.address,
        lat: uni.lat ? parseFloat(uni.lat) : undefined,
        lng: uni.lng ? parseFloat(uni.lng) : undefined,
        created_at: uni.created_at,
        updated_at: uni.updated_at,
      }));
    } catch (error) {
      console.error("Failed to fetch universities:", error);
      // Retourner des données de fallback en cas d'erreur (ne devrait pas arriver en production)
      console.error("Failed to fetch universities, using fallback data");
      return [];
    }
  }

  // Récupérer une université par ID
  async getUniversity(id: string): Promise<University | null> {
    try {
      const response = await this.request<University>(
        `/api/universities/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch university:", error);
      return null;
    }
  }

  // Récupérer tous les amphithéâtres
  async getAmphitheaters(): Promise<Classroom[]> {
    try {
      const response = await this.request<
        { classrooms: Classroom[] } | Classroom[]
      >("/api/classrooms");
      console.log("Amphitheaters response:", response); // Debug

      // Traiter les données selon la structure de votre API
      let amphitheaters = response.data?.classrooms || response.data || [];

      // Si c'est un objet avec une propriété classrooms
      if (
        response.data &&
        typeof response.data === "object" &&
        !Array.isArray(response.data)
      ) {
        amphitheaters = response.data.classrooms || [];
      }

      // Normaliser les données
      return amphitheaters.map((amphitheater: Classroom, index: number) => {
        console.log(`Amphitheater ${index}:`, amphitheater); // Debug

        if (!amphitheater.id) {
          console.error(
            "Amphitheater without ID found at index",
            index,
            ":",
            amphitheater,
          );
          throw new Error(
            `Amphitheater at index ${index} is missing required ID field`,
          );
        }

        if (!isValidUUID(amphitheater.id)) {
          console.warn(
            "Invalid UUID format for amphitheater ID:",
            amphitheater.id,
          );
        }

        return {
          id: amphitheater.id,
          name: amphitheater.name || "",
          slug: amphitheater.slug || "",
          lng: amphitheater.lng,
          lat: amphitheater.lat,
          capacity: amphitheater.capacity ? parseInt(amphitheater.capacity) : 0,
          equipment: amphitheater.equipment || [],
          status: amphitheater.status || "active",
          description: amphitheater.description || "",
          created_at: amphitheater.created_at,
          updated_at: amphitheater.updated_at,
          main_image: amphitheater.main_image,
          annexes: amphitheater.annexes || [],
        };
      });
    } catch (error) {
      console.error("Failed to fetch amphitheaters:", error);
      return [];
    }
  }

  // Créer un amphithéâtre
  async createAmphitheater(data: FormData): Promise<ApiResponse<Classroom>> {
    try {
      const response = await this.request("/api/classrooms", {
        method: "POST",
        body: data,
        headers: {
          // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
        },
      });
      return response;
    } catch (error) {
      console.error("Failed to create amphitheater:", error);
      throw error;
    }
  }

  // Mettre à jour un amphithéâtre
  async updateAmphitheater(
    id: string,
    data: FormData,
  ): Promise<ApiResponse<Classroom>> {
    try {
      if (!id) {
        throw new Error("ID is required for updating amphitheater");
      }

      if (!isValidUUID(id)) {
        console.warn("Invalid UUID format for amphitheater ID:", id);
      }

      // Laravel nécessite souvent _method=PUT pour les FormData
      data.append("_method", "PUT");

      console.log("Updating amphitheater with ID:", id); // Debug
      console.log("FormData for update:");
      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }

      const response = await this.request(`/api/classrooms/${id}`, {
        method: "POST", // Utiliser POST avec _method=PUT pour FormData
        body: data,
        headers: {
          // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
        },
      });
      return response;
    } catch (error) {
      console.error("Failed to update amphitheater:", error);
      throw error;
    }
  }

  // Récupérer les amphithéâtres d'une université
  async getUniversityClassrooms(universityId: string): Promise<Classroom[]> {
    try {
      const response = await this.request<
        { classrooms: Classroom[] } | Classroom[]
      >(`/api/universities/${universityId}/classrooms`);
      console.log("University classrooms response:", response); // Debug

      // Traiter les données selon la structure de votre API
      let classrooms = response.data?.classrooms || response.data || [];

      // Si c'est un objet avec une propriété classrooms
      if (
        response.data &&
        typeof response.data === "object" &&
        !Array.isArray(response.data)
      ) {
        classrooms = response.data.classrooms || [];
      }

      // Normaliser les données
      return classrooms.map((classroom: Classroom, index: number) => {
        console.log(`Classroom ${index}:`, classroom); // Debug pour voir la structure

        if (!classroom.id) {
          console.error(
            "Classroom without ID found at index",
            index,
            ":",
            classroom,
          );
          throw new Error(
            `Classroom at index ${index} is missing required ID field`,
          );
        }

        if (!isValidUUID(classroom.id)) {
          console.warn("Invalid UUID format for classroom ID:", classroom.id);
        }

        return {
          id: classroom.id, // ID du backend (UUID) - OBLIGATOIRE
          name: classroom.name || "",
          slug: classroom.slug || "",
          lng: classroom.lng,
          lat: classroom.lat,
          capacity: classroom.capacity ? parseInt(classroom.capacity) : 0,
          equipment: classroom.equipment || [],
          status: classroom.status || "active",
          description: classroom.description || "",
          created_at: classroom.created_at,
          updated_at: classroom.updated_at,
          main_image: classroom.main_image,
          annexes: classroom.annexes || [],
        };
      });
    } catch (error) {
      console.error("Failed to fetch university classrooms:", error);
      return [];
    }
  }

  // Supprimer un amphithéâtre
  async deleteAmphitheater(id: string): Promise<void> {
    try {
      console.log("🌐 API: deleteAmphitheater called with ID:", id);

      if (!id) {
        console.error("❌ API: No ID provided");
        throw new Error("ID requis pour la suppression de l'amphithéâtre");
      }

      if (!isValidUUID(id)) {
        console.warn("⚠️ API: Invalid UUID format for amphitheater ID:", id);
        // Continue anyway, let the server handle the validation
      }

      const url = `/api/classrooms/${id}`;
      console.log(
        "🌐 API: Making DELETE request to full URL:",
        `${API_BASE_URL}${url}`,
      );

      const response = await this.request(url, {
        method: "DELETE",
      });

      console.log("✅ API: Delete request successful, response:", response);

      // Vérifier si la suppression a vraiment réussi
      if (response.status >= 200 && response.status < 300) {
        console.log("🎯 API: Deletion confirmed with status:", response.status);
      } else {
        console.warn(
          "⚠️ API: Unexpected status code for deletion:",
          response.status,
        );
      }
    } catch (error) {
      console.error(
        "❌ API: Failed to delete amphitheater with detailed error:",
        {
          id,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      );

      // Améliorer le message d'erreur pour l'utilisateur
      if (error instanceof Error && error.message.includes("404")) {
        throw new Error("Amphithéâtre introuvable ou déjà supprimé");
      } else if (error instanceof Error && error.message.includes("403")) {
        throw new Error(
          "Vous n'avez pas les permissions pour supprimer cet amphithéâtre",
        );
      } else if (error instanceof Error && error.message.includes("500")) {
        throw new Error(
          "Erreur serveur lors de la suppression. Veuillez réessayer.",
        );
      }

      throw error;
    }
  }

  // Récupérer un amphithéâtre par ID
  async getAmphitheater(id: string): Promise<Classroom | null> {
    try {
      const response = await this.request<Classroom>(`/api/classrooms/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch amphitheater:", error);
      return null;
    }
  }
}

export const apiService = new ApiService();
export { isValidUUID, generateTempUUID };
export type { University, Classroom, ApiResponse };
