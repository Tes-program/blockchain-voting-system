// Updated src/App.tsx
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/layout/Layout';
import VoterRegistration from './pages/VoterRegistration';
import ProtectedRoute from './components/common/ProtectedRoute';
import ElectionsDashboard from './pages/ElectionDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VotingBooth from './pages/VotingBooth';
import VoteVerification from './pages/VoterVerification';
import ResultsPage from './pages/ResultPage';
import { useAuth } from './context/AuthContext';
import ElectionDetails from './pages/ElectionDetails';

function App() {
  const { isAuthenticated, needsRegistration, userRole } = useAuth();
  const location = useLocation();
  
  const RequireRegistration = () => {
    if (isAuthenticated && needsRegistration && !location.pathname.includes('/register')) {
      // Redirect to registration if needs to complete registration
      return <Navigate to="/register" state={{ from: location }} replace />;
    }
    
    return <Outlet />;
  };
  
  return (
    <Box height="100%">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="register" element={<VoterRegistration />} />
          
          {/* Routes that require registration to be completed */}
          <Route element={<RequireRegistration />}>
            {/* Public or authenticated routes */}
            <Route path="elections" element={<ElectionsDashboard />} />
            <Route path="elections/:electionId" element={<ElectionDetails />} />
            <Route path="results/:electionId" element={<ResultsPage />} />
            
            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute redirectPath="/" />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="vote/:electionId" element={<VotingBooth />} />
              <Route path="verify/:voteId" element={<VoteVerification />} />
            </Route>
            
            {/* Admin routes - require institution role */}
            <Route 
              path="admin" 
              element={
                <ProtectedRoute redirectPath="/">
                  {userRole === 'institution' ? <AdminDashboard /> : <Navigate to="/elections" replace />}
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="admin/elections/:electionId" 
              element={
                <ProtectedRoute redirectPath="/">
                  {userRole === 'institution' ? <AdminDashboard /> : <Navigate to="/elections" replace />}
                </ProtectedRoute>
              } 
            />
          </Route>
        </Route>
      </Routes>
    </Box>
  );
}

export default App;