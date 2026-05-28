import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LiveStreams from './pages/LiveStreams';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cameras from './pages/camera';
import './App.css';
import { Camera } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
   
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('store_name');
    setIsAuthenticated(false);
    setActivePage('Dashboard');
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard': return <Dashboard />;
      case 'Live Streams': return <LiveStreams />;
      case 'Analytics': return <Analytics />;
      case 'Store Settings': return <Settings mode="store" />;
      case "Camera" : return <Settings mode="camera"/>;
      default: return <Dashboard />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" replace />}
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <Sidebar
                  activePage={activePage}
                  setActivePage={setActivePage}
                  expanded={sidebarExpanded}
                  setExpanded={setSidebarExpanded}
                  onLogout={handleLogout}
                />
                <main className={`app-main ${sidebarExpanded ? 'main--expanded' : 'main--collapsed'}`}>
                  {renderPage()}
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}