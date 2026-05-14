import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Pitch from './pages/Pitch';
import ListingDetail from './pages/ListingDetail';
import Auth from './pages/Auth';
import Sell from './pages/Sell';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Inbox from './pages/Inbox';
import Conversation from './pages/Conversation';
import EditListing from './pages/EditListing';
import SellerProfile from './pages/SellerProfile';
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

function AppShell() {
  const location = useLocation();
  const isPitch = location.pathname === '/pitch';

  return (
    <>
      <OnboardingGuard />
      {!isPitch && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pitch" element={<Pitch />} />
        <Route path="/market" element={<Home />} />
        <Route path="/item/:id" element={<ListingDetail />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/inbox/:listingId/:otherUserId" element={<Conversation />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/seller/:sellerId" element={<SellerProfile />} />
      </Routes>
      {!isPitch && <Footer />}
      {!isPitch && <AuthModal />}
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <AppShell />
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}
