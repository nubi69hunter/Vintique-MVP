import { useState, useRef, useEffect } from 'react';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string;
  content: string;
  created_at: string;
}

export default function ChatModal() {
  const { isChatOpen, closeChat, chatContext, openAuthModal } = useUI();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  useEffect(() => {
    if (!isChatOpen || !chatContext || !user) return;

    const { listingId } = chatContext;
    setLoading(true);
    setMessages([]);

    supabase
      .from('messages')
      .select('*')
      .eq('listing_id', String(listingId))
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setMessages(data);
        setLoading(false);
      });

    const channel = supabase
      .channel(`messages-${listingId}-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `listing_id=eq.${listingId}` },
        (payload) => {
          const msg = payload.new as Message;
          if (msg.sender_id === user.id || msg.receiver_id === user.id) {
            setMessages(prev => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isChatOpen, chatContext, user]);

  if (!isChatOpen) return null;

  if (!user) {
    return (
      <div className="modal-overlay open" onClick={closeChat}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={closeChat}>✕</button>
          <div className="modal-title">Message Seller</div>
          <div className="modal-body">Please log in to send messages.</div>
          <button className="btn-primary" onClick={() => { closeChat(); openAuthModal(); }}>Login</button>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!inputVal.trim() || !chatContext || !user) return;
    const content = inputVal.trim();
    setInputVal('');
    setSending(true);
    try {
      await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: chatContext.sellerId,
        listing_id: String(chatContext.listingId),
        content,
      });
    } catch (_e) {
      // message will be picked up by realtime if insert succeeded
    } finally {
      setSending(false);
    }
  };

  const sellerName = chatContext?.sellerName || 'Seller';

  return (
    <div className="modal-overlay open" onClick={closeChat}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={closeChat}>✕</button>
        <div className="modal-title">Message {sellerName}</div>
        <div className="chat-messages">
          {loading && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>Loading...</div>
          )}
          {!loading && messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>
              No messages yet. Start the conversation!
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`chat-msg ${msg.sender_id === user.id ? 'sent' : 'received'}`}>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-row">
          <input
            className="chat-input"
            type="text"
            placeholder="Type a message..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !sending && handleSend()}
          />
          <button className="chat-send" onClick={handleSend} disabled={sending}>Send</button>
        </div>
      </div>
    </div>
  );
}
