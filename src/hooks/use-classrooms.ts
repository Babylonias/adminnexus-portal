import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import { PaginationMeta } from "@/services/api";
import { Classroom } from "@/models/classroom.model";

export const useClassrooms = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const fetchClassrooms = useCallback(async () => {
    try {
      console.log("🏛️ Hook: Starting fetchClassrooms...");
      setLoading(true);
      setError(null);

      console.log("🏛️ Hook: Calling apiService.getAmphitheaters()...");
      const { data, meta } = await apiService.getAmphitheaters();

      console.log("🏛️ Hook: Received classrooms data:", data);
      setClassrooms(data);
      setPagination(meta);
      console.log("🏛️ Hook: Classrooms state updated");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des salles de cours";
      setError(errorMessage);
      console.error("❌ Hook: Error fetching classrooms:", err);
    } finally {
      setLoading(false);
      console.log("🏛️ Hook: fetchClassrooms completed");
    }
  }, []);

  // Charger les salles de cours au montage du composant
  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  const createClassroom = async (
    formData: FormData,
  ): Promise<Classroom | null> => {
    try {
      const response = await apiService.createAmphitheater(formData);

      if (response.success) {
        // Recharger la liste des salles de cours
        await fetchClassrooms();
        toast.success("Salle de cours créée avec succès");
        return response.data;
      } else {
        throw new Error(response.message || "Erreur lors de la création");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de la salle de cours";
      toast.error(errorMessage);
      console.error("Error creating classroom:", err);
      return null;
    }
  };

  const updateClassroom = async (
    id: string,
    formData: FormData,
  ): Promise<Classroom | null> => {
    try {
      const response = await apiService.updateAmphitheater(id, formData);

      if (response.success) {
        // Recharger la liste des salles de cours
        await fetchClassrooms();
        toast.success("Salle de cours modifiée avec succès");
        return response.data;
      } else {
        throw new Error(response.message || "Erreur lors de la modification");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la modification de la salle de cours";
      toast.error(errorMessage);
      console.error("Error updating classroom:", err);
      return null;
    }
  };

  const deleteClassroom = async (id: string): Promise<boolean> => {
    try {
      console.log("🗑️ Hook: Starting delete for classroom ID:", id);

      if (!id) {
        console.error("❌ Hook: No ID provided for deletion");
        const errorMessage = "ID manquant pour la suppression";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Vérifier que la salle de cours existe dans la liste locale
      const existingClassroom = classrooms.find(
        (classroom) => classroom.id === id,
      );
      if (!existingClassroom) {
        console.error("❌ Hook: Classroom not found in local state:", id);
        const errorMessage = "Salle de cours introuvable";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      console.log("🔄 Hook: Calling API service deleteAmphitheater...");
      await apiService.deleteAmphitheater(id);

      console.log("✅ Hook: API call successful, updating local state...");
      // Supprimer de la liste locale
      setClassrooms((prev) => {
        const filtered = prev.filter((classroom) => classroom.id !== id);
        console.log(
          "📊 Hook: Updated classrooms list, removed item with ID:",
          id,
        );
        console.log("📊 Hook: New list length:", filtered.length);
        return filtered;
      });

      toast.success("Salle de cours supprimée avec succès");
      console.log("✅ Hook: Delete operation completed successfully");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de la salle de cours";
      console.error("❌ Hook: Error deleting classroom:", err);
      toast.error(errorMessage);
      return false;
    }
  };

  const getClassroom = async (id: string): Promise<Classroom | null> => {
    try {
      return await apiService.getAmphitheater(id);
    } catch (err) {
      console.error("Error fetching classroom:", err);
      return null;
    }
  };

  return {
    classrooms,
    loading,
    error,
    fetchClassrooms,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    getClassroom,
  };
};
