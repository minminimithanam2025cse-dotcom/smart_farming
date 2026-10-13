import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AppProvider } from './contexts/AppContext';
import AppLayout from './components/layout/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import CropDoctor from './pages/CropDoctor';
import SmartIrrigation from './pages/SmartIrrigation';
import WeatherMonitor from './pages/WeatherMonitor';
import FarmManagement from './pages/FarmManagement';
import DiagnosisHistory from './pages/DiagnosisHistory';
import SensorMonitor from './pages/SensorMonitor';
import TamilAssistant from './pages/TamilAssistant';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import HelpAbout from './pages/HelpAbout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60000,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/crop-doctor" element={<CropDoctor />} />
              <Route path="/irrigation" element={<SmartIrrigation />} />
              <Route path="/weather" element={<WeatherMonitor />} />
              <Route path="/farms" element={<FarmManagement />} />
              <Route path="/history" element={<DiagnosisHistory />} />
              <Route path="/sensors" element={<SensorMonitor />} />
              <Route path="/assistant" element={<TamilAssistant />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<HelpAbout />} />
            </Routes>
          </AppLayout>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
