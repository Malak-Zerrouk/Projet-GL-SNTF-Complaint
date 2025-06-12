import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { AgentDashboard } from './components/Dashboard/AgentDashboard';
import { NewComplaintForm } from './components/Complaints/NewComplaintForm';
import { ComplaintsList } from './components/Complaints/ComplaintsList';
import { ComplaintDetail } from './components/Complaints/ComplaintDetail';

function AppContent() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {authMode === 'login' ? (
          <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </>
    );
  }

  const renderContent = () => {
    if (selectedComplaintId) {
      return (
        <ComplaintDetail
          complaintId={selectedComplaintId}
          onBack={() => setSelectedComplaintId(null)}
        />
      );
    }

    // Voyageur views
    if (user.role === 'voyageur') {
      switch (activeView) {
        case 'new-complaint':
          return <NewComplaintForm />;
        case 'my-complaints':
          return (
            <ComplaintsList
              showAllComplaints={false}
              onComplaintSelect={setSelectedComplaintId}
              showFilters={false}
            />
          );
        default:
          return <NewComplaintForm />;
      }
    }

    // Agent views
    switch (activeView) {
      case 'dashboard':
        return <AgentDashboard />;
      case 'all-complaints':
        return (
          <ComplaintsList
            showAllComplaints={true}
            onComplaintSelect={setSelectedComplaintId}
            showFilters={true}
          />
        );
      default:
        return <AgentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;