import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import Auth from './pages/Auth';
import Sell from './pages/Sell';
import Profile from './pages/Profile';
import Toast from './components/Toast';
import ChatModal from './components/ChatModal';
import { UIProvider } from './contexts/UIContext';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/item/:id" element={<ListingDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <ChatModal />
          <Toast />
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}
