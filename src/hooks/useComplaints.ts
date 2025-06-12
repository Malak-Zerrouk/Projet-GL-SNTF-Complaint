import { useState, useEffect } from 'react';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

// Mock complaints data
const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: '1',
    userId: '1',
    title: 'Retard important du train Alger-Oran',
    description: 'Le train prévu à 08h00 a eu 2 heures de retard sans notification préalable.',
    category: 'delay',
    station: 'Gare d\'Alger',
    line: 'Alger-Oran',
    date: '2024-01-15',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    assignedAgent: 'Agent Benali',
    statusHistory: [
      {
        id: '1',
        status: 'submitted',
        updatedBy: 'Système',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        status: 'accepted',
        comment: 'Réclamation prise en compte',
        updatedBy: 'Agent Benali',
        updatedAt: '2024-01-15T14:00:00Z',
      },
      {
        id: '3',
        status: 'in_progress',
        comment: 'Investigation en cours',
        updatedBy: 'Agent Benali',
        updatedAt: '2024-01-16T09:00:00Z',
      },
    ],
  },
  {
    id: '2',
    userId: '1',
    title: 'Problème de climatisation',
    description: 'La climatisation ne fonctionnait pas dans le wagon 3.',
    category: 'technical',
    station: 'Gare de Constantine',
    line: 'Constantine-Alger',
    date: '2024-01-10',
    status: 'treated',
    priority: 'medium',
    createdAt: '2024-01-10T16:20:00Z',
    updatedAt: '2024-01-12T11:30:00Z',
    assignedAgent: 'Agent Saidi',
    statusHistory: [
      {
        id: '4',
        status: 'submitted',
        updatedBy: 'Système',
        updatedAt: '2024-01-10T16:20:00Z',
      },
      {
        id: '5',
        status: 'accepted',
        updatedBy: 'Agent Saidi',
        updatedAt: '2024-01-11T08:00:00Z',
      },
      {
        id: '6',
        status: 'in_progress',
        updatedBy: 'Agent Saidi',
        updatedAt: '2024-01-11T14:00:00Z',
      },
      {
        id: '7',
        status: 'treated',
        comment: 'Système de climatisation réparé',
        updatedBy: 'Agent Saidi',
        updatedAt: '2024-01-12T11:30:00Z',
      },
    ],
  },
];

export function useComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (user?.role === 'voyageur') {
        setComplaints(MOCK_COMPLAINTS.filter(c => c.userId === user.id));
      } else {
        setComplaints(MOCK_COMPLAINTS);
      }
      setLoading(false);
    }, 1000);
  }, [user]);

  const createComplaint = async (complaintData: Partial<Complaint>) => {
    if (!user) return;

    const newComplaint: Complaint = {
      id: Date.now().toString(),
      userId: user.id,
      status: 'submitted',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          id: Date.now().toString(),
          status: 'submitted',
          updatedBy: 'Système',
          updatedAt: new Date().toISOString(),
        },
      ],
      ...complaintData,
    } as Complaint;

    setComplaints(prev => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateComplaintStatus = async (
    complaintId: string, 
    status: ComplaintStatus, 
    comment?: string
  ) => {
    if (!user) return;

    setComplaints(prev =>
      prev.map(complaint => {
        if (complaint.id === complaintId) {
          const newHistoryEntry = {
            id: Date.now().toString(),
            status,
            comment,
            updatedBy: user.name,
            updatedAt: new Date().toISOString(),
          };

          return {
            ...complaint,
            status,
            updatedAt: new Date().toISOString(),
            statusHistory: [...complaint.statusHistory, newHistoryEntry],
          };
        }
        return complaint;
      })
    );
  };

  const filterComplaints = (
    category?: ComplaintCategory,
    status?: ComplaintStatus,
    station?: string,
    dateFrom?: string,
    dateTo?: string
  ) => {
    return complaints.filter(complaint => {
      if (category && complaint.category !== category) return false;
      if (status && complaint.status !== status) return false;
      if (station && complaint.station !== station) return false;
      if (dateFrom && complaint.date < dateFrom) return false;
      if (dateTo && complaint.date > dateTo) return false;
      return true;
    });
  };

  return {
    complaints,
    loading,
    createComplaint,
    updateComplaintStatus,
    filterComplaints,
  };
}