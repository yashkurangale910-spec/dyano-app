import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LayoutShell from './components/ui/LayoutShell';
import './index.css';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const QuizLab = lazy(() => import('./pages/QuizLab'));
const FlashcardSpace = lazy(() => import('./pages/FlashcardSpace'));
const PDFLab = lazy(() => import('./pages/PDFLab'));
const ProgressJourney = lazy(() => import('./pages/ProgressJourney'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const ChatBot = lazy(() => import('./pages/ChatBot'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ImageGen = lazy(() => import('./pages/ImageGen'));

import LoadingState from './components/ui/LoadingState';
import NeuralCursor from './components/ui/NeuralCursor';
import { AtmosphericProvider } from './context/AtmosphericContext';
import { TutorProvider } from './context/TutorContext';

const queryClient = new QueryClient();

function LoadingScreen() {
  return (
    <div className="h-screen w-full flex-center bg-bg-main">
      <LoadingState
        variant="spinner"
        label="Initializing Dyano"
        message="Establishing secure neural uplink to the cognitive archive..."
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TutorProvider>
          <Router>
            <Suspense fallback={<LoadingScreen />}>
              <AtmosphericProvider>
                <Routes>
                  <Route path="/chatbot" element={<ChatBot />} />

                  <Route element={<LayoutShell />}>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* All Routes - No Authentication Required */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/quiz" element={<QuizLab />} />
                    <Route path="/flashcards" element={<FlashcardSpace />} />
                    <Route path="/pdf" element={<PDFLab />} />
                    <Route path="/progress" element={<ProgressJourney />} />
                    <Route path="/roadmap" element={<Roadmap />} />
                    <Route path="/imagine" element={<ImageGen />} />
                    <Route path="/chatbot" element={<ChatBot />} />
                  </Route>
                </Routes>
              </AtmosphericProvider>
            </Suspense>
            <Toaster position="top-right" />
            {/* <NeuralCursor /> */}
          </Router>
        </TutorProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
