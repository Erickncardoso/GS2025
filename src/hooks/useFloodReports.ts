
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FloodReport {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'duplicate';
  latitude: number;
  longitude: number;
  neighborhood: string;
  address?: string;
  water_level?: number;
  affected_people: number;
  user_id?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  report_date: string;
  created_at: string;
  updated_at: string;
}

export const useFloodReports = (approved?: boolean) => {
  const [reports, setReports] = useState<FloodReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('flood_reports')
        .select('*')
        .order('report_date', { ascending: false });

      if (approved !== undefined) {
        const status = approved ? 'approved' : 'pending';
        query = query.eq('status', status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setReports(data || []);
    } catch (err) {
      console.error('Erro ao buscar relatos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportData: Partial<FloodReport>) => {
    try {
      const { data, error } = await supabase
        .from('flood_reports')
        .insert({
          title: reportData.title || 'Relato de Enchente',
          message: reportData.message,
          severity: reportData.severity || 'moderate',
          latitude: reportData.latitude,
          longitude: reportData.longitude,
          neighborhood: reportData.neighborhood,
          address: reportData.address,
          water_level: reportData.water_level,
          affected_people: reportData.affected_people || 0,
          status: 'pending',
          user_id: reportData.user_id,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchReports(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Erro ao criar relato:', err);
      throw err;
    }
  };

  const approveReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('flood_reports')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      await fetchReports(); // Refresh the list
    } catch (err) {
      console.error('Erro ao aprovar relato:', err);
      throw err;
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('flood_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      await fetchReports(); // Refresh the list
    } catch (err) {
      console.error('Erro ao deletar relato:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchReports();
  }, [approved]);

  return {
    reports,
    loading,
    error,
    createReport,
    approveReport,
    deleteReport,
    refetch: fetchReports
  };
};
