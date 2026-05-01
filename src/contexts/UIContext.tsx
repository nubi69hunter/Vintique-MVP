import { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatContext {
  listingId: string | number;
  sellerId: string;
  sellerName: string;
}

interface UIContextType {
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isChatOpen: boolean;
  openChat: (ctx: ChatContext) => void;
  closeChat: () => void;
  chatContext: ChatContext | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<ChatContext | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openChat = (ctx: ChatContext) => {
    setChatContext(ctx);
    setIsChatOpen(true);
  };
  const closeChat = () => {
    setIsChatOpen(false);
    setChatContext(null);
  };
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <UIContext.Provider value={{ toastMessage, showToast, isChatOpen, openChat, closeChat, chatContext, isAuthModalOpen, openAuthModal, closeAuthModal }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) throw new Error('useUI must be used within a UIProvider');
  return context;
}
