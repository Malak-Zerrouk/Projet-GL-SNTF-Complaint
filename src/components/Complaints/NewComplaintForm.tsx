import React, { useState } from 'react';
import { useComplaints } from '../../hooks/useComplaints';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  MapPin, 
  Calendar, 
  Upload, 
  X,
  AlertCircle,
  Video,
  Music,
  Image
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const CATEGORIES = [
  { value: 'delay', label: 'Retard' },
  { value: 'payment', label: 'Paiement' },
  { value: 'technical', label: 'Problème technique' },
  { value: 'security', label: 'Sécurité' },
  { value: 'cleanliness', label: 'Propreté' },
  { value: 'staff', label: 'Comportement du personnel' },
  { value: 'other', label: 'Autre' },
];

const STATIONS = [
  'Gare d\'Alger',
  'Gare d\'Oran',
  'Gare de Constantine',
  'Gare de Annaba',
  'Gare de Tlemcen',
  'Gare de Sétif',
  'Gare de Batna',
  'Gare de Béjaïa',
  'Gare de Skikda',
  'Gare de Jijel',
];

export function NewComplaintForm() {
  const { createComplaint } = useComplaints();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'delay',
    station: '',
    line: '',
    date: new Date().toISOString().split('T')[0],
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-5 w-5 text-purple-500" />;
    } else if (file.type.startsWith('audio/')) {
      return <Music className="h-5 w-5 text-green-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFileTypeLabel = (file: File) => {
    if (file.type.startsWith('image/')) {
      return 'Image';
    } else if (file.type.startsWith('video/')) {
      return 'Vidéo';
    } else if (file.type.startsWith('audio/')) {
      return 'Audio';
    } else {
      return 'Document';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Validate file size (max 50MB per file)
      const maxSize = 50 * 1024 * 1024; // 50MB
      const validFiles = newFiles.filter(file => {
        if (file.size > maxSize) {
          toast.error(`Le fichier "${file.name}" est trop volumineux (max 50MB)`);
          return false;
        }
        return true;
      });

      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you would upload files to a server first
      const mockAttachments = files.map(file => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
      }));

      await createComplaint({
        ...formData,
        attachments: mockAttachments,
      });

      toast.success('Réclamation soumise avec succès!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'delay',
        station: '',
        line: '',
        date: new Date().toISOString().split('T')[0],
      });
      setFiles([]);
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nouvelle réclamation</h1>
        <p className="text-gray-600">Décrivez votre problème en détail pour un traitement optimal</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Titre de la réclamation *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Résumé bref de votre réclamation"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date de l'incident *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                id="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="station" className="block text-sm font-medium text-gray-700 mb-2">
              Gare concernée *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                id="station"
                required
                value={formData.station}
                onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner une gare</option>
                {STATIONS.map(station => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="line" className="block text-sm font-medium text-gray-700 mb-2">
              Ligne (optionnel)
            </label>
            <input
              type="text"
              id="line"
              value={formData.line}
              onChange={(e) => setFormData({ ...formData, line: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Alger-Oran"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description détaillée *
          </label>
          <textarea
            id="description"
            required
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Décrivez le problème rencontré avec le maximum de détails (heure, circonstances, conséquences, etc.)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pièces jointes (optionnel)
          </label>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                  </p>
                  <div className="text-xs text-gray-500 text-center">
                    <p className="mb-1">📷 Images: PNG, JPG, JPEG</p>
                    <p className="mb-1">🎥 Vidéos: MP4, AVI, MOV, WMV</p>
                    <p className="mb-1">🎵 Audio: MP3, WAV, AAC, OGG</p>
                    <p>📄 Documents: PDF</p>
                    <p className="mt-2 font-medium">Taille max: 50MB par fichier</p>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,video/*,audio/*,application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Fichiers sélectionnés ({files.length})
                </h4>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span className="px-2 py-1 bg-gray-200 rounded-full">
                            {getFileTypeLabel(file)}
                          </span>
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Supprimer le fichier"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Information importante</h3>
              <div className="text-sm text-blue-700 mt-1 space-y-1">
                <p>• Votre réclamation sera examinée dans les plus brefs délais</p>
                <p>• Vous recevrez une notification dès qu'un agent aura pris en charge votre dossier</p>
                <p>• Les fichiers multimédias (vidéo/audio) peuvent aider à mieux comprendre votre problème</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Soumission...' : 'Soumettre la réclamation'}
          </button>
        </div>
      </form>
    </div>
  );
}