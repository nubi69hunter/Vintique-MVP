import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import Auth from './pages/Auth';
import Sell from './pages/Sell';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Inbox from './pages/Inbox';
import Conversation from './pages/Conversation';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import { UIProvider } from './contexts/UIContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function OnboardingGuard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading || !user || profile === undefined) return;
    if (!profile?.first_name && location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [user, profile, loading, navigate, location.pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <OnboardingGuard />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/item/:id" element={<ListingDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/inbox/:listingId/:otherUserId" element={<Conversation />} />
          </Routes>
          <AuthModal />
          <Toast />
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}
