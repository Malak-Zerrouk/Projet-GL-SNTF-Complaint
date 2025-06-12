import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useComplaints } from '../../hooks/useComplaints';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { FileText, Users, TrendingUp, AlertCircle } from 'lucide-react';

const COLORS = {
  submitted: '#3b82f6',
  accepted: '#10b981',
  in_progress: '#f59e0b',
  treated: '#059669',
  rejected: '#ef4444',
};

const CATEGORY_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'
];

export function AgentDashboard() {
  const { stats, loading } = useDashboard();
  const { complaints } = useComplaints();

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statusData = Object.entries(stats.complaintsByStatus).map(([status, count]) => ({
    name: status,
    value: count,
    label: status === 'submitted' ? 'Soumises' :
           status === 'accepted' ? 'Acceptées' :
           status === 'in_progress' ? 'En cours' :
           status === 'treated' ? 'Traitées' : 'Rejetées'
  }));

  const categoryData = Object.entries(stats.complaintsByCategory).map(([category, count]) => ({
    name: category,
    value: count,
    label: category === 'delay' ? 'Retards' :
           category === 'technical' ? 'Technique' :
           category === 'cleanliness' ? 'Propreté' :
           category === 'staff' ? 'Personnel' :
           category === 'security' ? 'Sécurité' :
           category === 'payment' ? 'Paiement' : 'Autre'
  }));

  const stationData = Object.entries(stats.complaintsByStation).map(([station, count]) => ({
    name: station.replace('Gare d\'', '').replace('Gare de ', ''),
    value: count
  }));

  const combinedTrendData = stats.weeklyTrend.map((trend, index) => ({
    date: trend.date,
    actual: trend.count,
    predicted: stats.prediction[index]?.predicted || 0
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Agent</h1>
        <p className="text-gray-600">Vue d'ensemble des réclamations et analyses</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Réclamations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.complaintsByStatus.submitted || 0) + (stats.complaintsByStatus.accepted || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taux de Résolution</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalComplaints > 0 
                  ? Math.round(((stats.complaintsByStatus.treated || 0) / stats.totalComplaints) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stations Actives</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(stats.complaintsByStation).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Statut</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${Math.round(percent)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, statusData.find(s => s.name === name)?.label]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Aucune donnée à afficher
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Catégorie</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="label" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Aucune donnée à afficher
            </div>
          )}
        </div>

        {/* Station Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Réclamations par Gare</h3>
          {stationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stationData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Aucune donnée à afficher
            </div>
          )}
        </div>

        {/* Trend and Prediction */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendance et Prédictions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Réel"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#f59e0b" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Prédiction"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}