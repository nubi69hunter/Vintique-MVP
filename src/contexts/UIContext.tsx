import { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <UIContext.Provider value={{ toastMessage, showToast, isChatOpen, openChat, closeChat, isAuthModalOpen, openAuthModal, closeAuthModal }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) throw new Error('useUI must be used within a UIProvider');
  return context;
}
