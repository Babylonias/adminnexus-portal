import { useState, useEffect } from 'react';
import { apiService, type University } from '@/services/api';

export const useUniversities = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUniversities();
      console.log('Universities fetched:', data); // Debug
      setUniversities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des universités');
      console.error('Error fetching universities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  return {
    universities,
    loading,
    error,
    refetch: fetchUniversities
  };
};