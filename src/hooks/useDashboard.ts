import { useState, useEffect } from 'react';
import { DashboardStats } from '../types';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call for dashboard data
    setTimeout(() => {
      const mockStats: DashboardStats = {
        totalComplaints: 247,
        complaintsByStatus: {
          submitted: 45,
          accepted: 23,
          rejected: 12,
          in_progress: 67,
          treated: 100,
        },
        complaintsByCategory: {
          delay: 89,
          technical: 54,
          cleanliness: 32,
          staff: 28,
          security: 21,
          payment: 15,
          other: 8,
        },
        complaintsByStation: {
          'Gare d\'Alger': 78,
          'Gare d\'Oran': 45,
          'Gare de Constantine': 34,
          'Gare de Annaba': 28,
          'Gare de Tlemcen': 22,
          'Gare de Sétif': 19,
          'Gare de Batna': 21,
        },
        weeklyTrend: [
          { date: '2024-01-08', count: 12 },
          { date: '2024-01-09', count: 18 },
          { date: '2024-01-10', count: 15 },
          { date: '2024-01-11', count: 22 },
          { date: '2024-01-12', count: 19 },
          { date: '2024-01-13', count: 25 },
          { date: '2024-01-14', count: 16 },
        ],
        prediction: [
          { date: '2024-01-15', predicted: 20 },
          { date: '2024-01-16', predicted: 23 },
          { date: '2024-01-17', predicted: 18 },
          { date: '2024-01-18', predicted: 26 },
          { date: '2024-01-19', predicted: 22 },
          { date: '2024-01-20', predicted: 19 },
          { date: '2024-01-21', predicted: 24 },
        ],
      };
      
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  return { stats, loading };
}