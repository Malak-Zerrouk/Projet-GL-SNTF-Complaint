import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import { Train, User, LogOut, Bell, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, markAsRead, unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    // In a real app, you would navigate to the complaint
    console.log('Navigate to complaint:', notification.complaintId);
  };

  return (
    <nav className="bg-blue-800 text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Train className="h-8 w-8 text-blue-300" />
            <div>
              <h1 className="text-xl font-bold">SNTF Complaint</h1>
              <p className="text-xs text-blue-300">Système de Réclamations</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-blue-700 transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p>Aucune notification</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {format(new Date(notification.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <div className="text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-blue-300 capitalize">{user.role}</p>
                  </div>
                </div>
                
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}