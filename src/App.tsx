// src/App.tsx
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import LandingPage from './pages/LandingPage';
// import ElectionsDashboard from './pages/ElectionsDashboard';
// import VotingBooth from './pages/VotingBooth';
// import VoteVerification from './pages/VoteVerification';
// import ResultsPage from './pages/ResultsPage';
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
  const { userRole } = useAuth();

  const RequireRegistration = () => {
    const { isAuthenticated, isRegistrationComplete } = useAuth();
    const location = useLocation();
    
    if (isAuthenticated && !isRegistrationComplete && !location.pathname.includes('/register')) {
      // Redirect to registration if authenticated but not registered
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
          <Route path="elections" element={<ElectionsDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="vote/:electionId" element={<VotingBooth />} />
          <Route path="verify/:voteId" element={<VoteVerification />} />
          <Route path="results/:electionId" element={<ResultsPage />} />
          <Route path="elections/:electionId" element={<ElectionDetails />} />

          {/* <Route path="results/:electionId" element={<ResultsPage />} /> */}
          
          {/* Protected voter routes */}
          <Route element={<ProtectedRoute redirectPath="/" />}>
            {/* <Route 
              path="elections" 
              element={
                userRole === 'admin' 
                  ? <Navigate to="/admin/dashboard" replace /> 
                  : <ElectionsDashboard />
              } 
            />
            <Route path="vote/:electionId" element={<VotingBooth />} />
            <Route path="verify/:voteId" element={<VoteVerification />} /> */}
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Admin routes */}
          <Route 
            path="admin/elections/:electionId" 
            element={
              <ProtectedRoute redirectPath="/">
                {userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/elections" replace />}
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;