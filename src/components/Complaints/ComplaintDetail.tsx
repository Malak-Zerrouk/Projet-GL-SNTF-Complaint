import React, { useState } from 'react';
import { useComplaints } from '../../hooks/useComplaints';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  FileText, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

interface ComplaintDetailProps {
  complaintId: string;
  onBack: () => void;
}

export function ComplaintDetail({ complaintId, onBack }: ComplaintDetailProps) {
  const { complaints, updateComplaintStatus } = useComplaints();
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [updating, setUpdating] = useState(false);
  
  const complaint = complaints.find(c => c.id === complaintId);
  
  if (!complaint) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Réclamation introuvable</h3>
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-500"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      await updateComplaintStatus(complaint.id, newStatus as any, comment);
      toast.success('Statut mis à jour avec succès');
      setComment('');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'treated':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Soumise';
      case 'accepted':
        return 'Acceptée';
      case 'rejected':
        return 'Rejetée';
      case 'in_progress':
        return 'En cours';
      case 'treated':
        return 'Traitée';
      default:
        return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'delay':
        return 'Retard';
      case 'payment':
        return 'Paiement';
      case 'technical':
        return 'Problème technique';
      case 'security':
        return 'Sécurité';
      case 'cleanliness':
        return 'Propreté';
      case 'staff':
        return 'Comportement du personnel';
      case 'other':
        return 'Autre';
      default:
        return category;
    }
  };

  const canUpdateStatus = user?.role === 'agent';
  const nextStatuses = getNextStatuses(complaint.status);

  function getNextStatuses(currentStatus: string) {
    switch (currentStatus) {
      case 'submitted':
        return ['accepted', 'rejected'];
      case 'accepted':
        return ['in_progress'];
      case 'in_progress':
        return ['treated'];
      default:
        return [];
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Retour</span>
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{complaint.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
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
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(complaint.status)}
            <span className="font-medium">{getStatusLabel(complaint.status)}</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
        </div>

        {complaint.line && (
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-700">Ligne: </span>
            <span className="text-sm text-gray-600">{complaint.line}</span>
          </div>
        )}

        {complaint.attachments && complaint.attachments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Pièces jointes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complaint.attachments.map((attachment) => (
                <div key={attachment.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(attachment.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique des statuts</h2>
        <div className="space-y-4">
          {complaint.statusHistory.map((entry, index) => (
            <div key={entry.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getStatusIcon(entry.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {getStatusLabel(entry.status)}
                  </span>
                  <span className="text-sm text-gray-500">
                    par {entry.updatedBy}
                  </span>
                  <span className="text-sm text-gray-400">
                    {format(new Date(entry.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </span>
                </div>
                {entry.comment && (
                  <p className="text-sm text-gray-600 mt-1">{entry.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Actions */}
      {canUpdateStatus && nextStatuses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions agent</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire (optionnel)
              </label>
              <textarea
                id="comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ajoutez un commentaire pour expliquer votre décision..."
              />
            </div>
            
            <div className="flex space-x-3">
              {nextStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={updating}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    status === 'accepted' || status === 'in_progress' || status === 'treated'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {updating ? 'Mise à jour...' : getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}