import React, { useState } from 'react';
import { useComplaints } from '../../hooks/useComplaints';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  Filter, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const CATEGORIES = [
  { value: '', label: 'Toutes les catégories' },
  { value: 'delay', label: 'Retard' },
  { value: 'payment', label: 'Paiement' },
  { value: 'technical', label: 'Problème technique' },
  { value: 'security', label: 'Sécurité' },
  { value: 'cleanliness', label: 'Propreté' },
  { value: 'staff', label: 'Comportement du personnel' },
  { value: 'other', label: 'Autre' },
];

const STATUSES = [
  { value: '', label: 'Tous les statuts' },
  { value: 'submitted', label: 'Soumise' },
  { value: 'accepted', label: 'Acceptée' },
  { value: 'rejected', label: 'Rejetée' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'treated', label: 'Traitée' },
];

interface ComplaintsListProps {
  showAllComplaints?: boolean;
  onComplaintSelect?: (complaintId: string) => void;
  showFilters?: boolean;
}

export function ComplaintsList({ 
  showAllComplaints = false, 
  onComplaintSelect,
  showFilters = true 
}: ComplaintsListProps) {
  const { complaints, loading } = useComplaints();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    station: '',
    dateFrom: '',
    dateTo: '',
  });

  const filteredComplaints = complaints.filter(complaint => {
    if (!showAllComplaints && complaint.userId !== user?.id) return false;
    
    if (filters.search && !complaint.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !complaint.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    if (filters.category && complaint.category !== filters.category) return false;
    if (filters.status && complaint.status !== filters.status) return false;
    if (filters.station && complaint.station !== filters.station) return false;
    if (filters.dateFrom && complaint.date < filters.dateFrom) return false;
    if (filters.dateTo && complaint.date > filters.dateTo) return false;
    
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'treated':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return STATUSES.find(s => s.value === status)?.label || status;
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find(c => c.value === category)?.label || category;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showAllComplaints ? 'Toutes les réclamations' : 'Mes réclamations'}
          </h1>
          <p className="text-gray-600">
            {filteredComplaints.length} réclamation{filteredComplaints.length > 1 ? 's' : ''} trouvée{filteredComplaints.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters - Only show for agents */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {STATUSES.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Filtrer par gare..."
              value={filters.station}
              onChange={(e) => setFilters({ ...filters, station: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <input
              type="date"
              placeholder="Date de début"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <input
              type="date"
              placeholder="Date de fin"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réclamation trouvée</h3>
          <p className="text-gray-600">
            {showAllComplaints
              ? 'Aucune réclamation ne correspond à vos critères de recherche.'
              : 'Vous n\'avez pas encore soumis de réclamation.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {getStatusLabel(complaint.status)}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority === 'high' ? 'Haute' : 
                         complaint.priority === 'medium' ? 'Moyenne' : 'Faible'} priorité
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{complaint.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(complaint.date), 'dd MMMM yyyy', { locale: fr })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{complaint.station}</span>
                      </div>
                      <div className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {getCategoryLabel(complaint.category)}
                      </div>
                      {showAllComplaints && (
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>ID: {complaint.userId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onComplaintSelect?.(complaint.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    
                    {!showAllComplaints && complaint.status === 'submitted' && (
                      <>
                        <button className="p-2 text-gray-400 hover:text-yellow-600 transition-colors" title="Modifier">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Supprimer">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}