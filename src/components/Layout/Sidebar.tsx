import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  FileText, 
  PlusCircle
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { user } = useAuth();

  const voyageurMenuItems = [
    { id: 'new-complaint', label: 'Nouvelle réclamation', icon: PlusCircle },
    { id: 'my-complaints', label: 'Mes réclamations', icon: FileText },
  ];

  const agentMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'all-complaints', label: 'Toutes les réclamations', icon: FileText },
  ];

  const menuItems = user?.role === 'agent' ? agentMenuItems : voyageurMenuItems;

  return (
    <aside className="bg-gray-50 w-64 min-h-screen border-r border-gray-200">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}