import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CompanyPage from './pages/CompanyPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { DataProvider } from './contexts/DataContext';
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import HoldingSettingsPage from './pages/admin/HoldingSettingsPage';
import CompaniesListPage from './pages/admin/CompaniesListPage';
import CompanyEditPage from './pages/admin/CompanyEditPage';
import TrainingPage from './pages/TrainingPage';
import TrainingListPage from './pages/admin/TrainingListPage';
import TrainingEditPage from './pages/admin/TrainingEditPage';

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={<MainLayout />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<LoginPage />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="holding" element={<HoldingSettingsPage />} />
                  <Route path="companies" element={<CompaniesListPage />} />
                  <Route path="company/:slug" element={<CompanyEditPage />} />
                  <Route path="company/new" element={<CompanyEditPage />} />
                  <Route path="training" element={<TrainingListPage />} />
                  <Route path="training/:id" element={<TrainingEditPage />} />
                  <Route path="training/new" element={<TrainingEditPage />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </DataProvider>
  );
};

// Layout for public facing pages
const MainLayout: React.FC = () => {
  return (
     <div className="bg-gray-100 text-[#555555] min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/company/:slug" element={<CompanyPage />} />
            <Route path="/training" element={<TrainingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
  )
}

export default App;