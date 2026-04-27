import { useState, useRef, useEffect } from 'react';
import { useUI } from '../contexts/UIContext';

interface Message {
  text: string;
  isSent: boolean;
}

export default function ChatModal() {
  const { isChatOpen, closeChat } = useUI();
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hi! Is this still available?', isSent: false },
    { text: 'Yes it is! Feel free to ask anything 😊', isSent: true },
  ]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = () => {
    if (!inputVal.trim()) return;
    
    setMessages(prev => [...prev, { text: inputVal, isSent: true }]);
    setInputVal('');

    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'Thanks for your message! I\'ll get back to you soon 😊', isSent: false }]);
    }, 1000);
  };

  return (
    <div className="modal-overlay open" onClick={closeChat}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={closeChat}>✕</button>
        <div className="modal-title">Message Seller</div>
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.isSent ? 'sent' : 'received'}`}>
              {msg.text}
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
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button className="chat-send" onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}
