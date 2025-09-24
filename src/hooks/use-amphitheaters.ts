import { useState, useEffect } from 'react';
import { apiService, type Classroom } from '@/services/api';
import { toast } from 'sonner';

export const useAmphitheaters = () => {
  const [amphitheaters, setAmphitheaters] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAmphitheaters = async () => {
    try {
      console.log('🏛️ Hook: Starting fetchAmphitheaters...');
      setLoading(true);
      setError(null);
      
      console.log('🏛️ Hook: Calling apiService.getAmphitheaters()...');
      const data = await apiService.getAmphitheaters();
      
      console.log('🏛️ Hook: Received amphitheaters data:', data);
      setAmphitheaters(data);
      console.log('🏛️ Hook: Amphitheaters state updated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des amphithéâtres';
      setError(errorMessage);
      console.error('❌ Hook: Error fetching amphitheaters:', err);
    } finally {
      setLoading(false);
      console.log('🏛️ Hook: fetchAmphitheaters completed');
    }
  };

  const createAmphitheater = async (formData: FormData): Promise<Classroom | null> => {
    try {
      const response = await apiService.createAmphitheater(formData);
      
      if (response.success) {
        // Recharger la liste des amphithéâtres
        await fetchAmphitheaters();
        toast.success('Amphithéâtre créé avec succès');
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de la création');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de l\'amphithéâtre';
      toast.error(errorMessage);
      console.error('Error creating amphitheater:', err);
      return null;
    }
  };

  const updateAmphitheater = async (id: string, formData: FormData): Promise<Classroom | null> => {
    try {
      const response = await apiService.updateAmphitheater(id, formData);
      
      if (response.success) {
        // Recharger la liste des amphithéâtres
        await fetchAmphitheaters();
        toast.success('Amphithéâtre modifié avec succès');
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de la modification');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification de l\'amphithéâtre';
      toast.error(errorMessage);
      console.error('Error updating amphitheater:', err);
      return null;
    }
  };

  const deleteAmphitheater = async (id: string): Promise<boolean> => {
    try {
      console.log('🗑️ Hook: Starting delete for amphitheater ID:', id);
      
      if (!id) {
        console.error('❌ Hook: No ID provided for deletion');
        toast.error('ID manquant pour la suppression');
        return false;
      }

      console.log('🔄 Hook: Calling API service deleteAmphitheater...');
      await apiService.deleteAmphitheater(id);
      
      console.log('✅ Hook: API call successful, updating local state...');
      // Supprimer de la liste locale
      setAmphitheaters(prev => {
        const filtered = prev.filter(amp => amp.id !== id);
        console.log('📊 Hook: Updated amphitheaters list, removed item with ID:', id);
        console.log('📊 Hook: New list length:', filtered.length);
        return filtered;
      });
      
      toast.success('Amphithéâtre supprimé avec succès');
      console.log('✅ Hook: Delete operation completed successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'amphithéâtre';
      console.error('❌ Hook: Error deleting amphitheater:', err);
      toast.error(errorMessage);
      return false;
    }
  };

  const getAmphitheater = async (id: string): Promise<Classroom | null> => {
    try {
      return await apiService.getAmphitheater(id);
    } catch (err) {
      console.error('Error fetching amphitheater:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchAmphitheaters();
  }, []);

  return {
    amphitheaters,
    loading,
    error,
    fetchAmphitheaters,
    createAmphitheater,
    updateAmphitheater,
    deleteAmphitheater,
    getAmphitheater,
  };
};