import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { supabase } from '../lib/supabase';
import { Listing } from '../data';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface OtherProfile {
  id: string;
  username: string;
  first_name: string | null;
  avatar_url: string | null;
}

function formatTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

function shouldGroup(prev: Message, curr: Message): boolean {
  if (prev.sender_id !== curr.sender_id) return false;
  return new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime() < 60000;
}

function Avatar({ avatarUrl, initial, hidden }: { avatarUrl: string | null | undefined; initial: string; hidden?: boolean }) {
  return (
    <div className="conv-avatar" style={{ visibility: hidden ? 'hidden' : 'visible', overflow: 'hidden' }}>
      {avatarUrl
        ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initial
      }
    </div>
  );
}

export default function Conversation() {
  const { listingId, otherUserId } = useParams<{ listingId: string; otherUserId: string }>();
  const { user, profile } = useAuth();
  const { openAuthModal } = useUI();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [sending, setSending] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);
  const [otherProfile, setOtherProfile] = useState<OtherProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user || !listingId || !otherUserId) return;

    supabase.from('listings').select('*').eq('id', listingId).single()
      .then(({ data }) => { if (data) setListing(data); });

    supabase.from('profiles').select('id, username, first_name, avatar_url').eq('id', otherUserId).single()
      .then(({ data }) => { if (data) setOtherProfile(data); });

    supabase.from('messages').select('*')
      .eq('listing_id', listingId)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) {
          setMessages(data.filter(m =>
            (m.sender_id === user.id && m.receiver_id === otherUserId) ||
            (m.sender_id === otherUserId && m.receiver_id === user.id)
          ));
        }
      });

    supabase.from('messages')
      .update({ is_read: true })
      .eq('listing_id', listingId)
      .eq('receiver_id', user.id)
      .eq('sender_id', otherUserId)
      .then(() => {});

    const channel = supabase
      .channel(`conv-${listingId}-${user.id}-${otherUserId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `listing_id=eq.${listingId}`,
      }, (payload) => {
        const msg = payload.new as Message;
        if (
          !(
            (msg.sender_id === user.id && msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.receiver_id === user.id)
          )
        ) return;

        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          const tempIdx = prev.findIndex(m =>
            m.id.startsWith('temp-') &&
            m.sender_id === msg.sender_id &&
            m.content === msg.content
          );
          if (tempIdx !== -1) {
            const next = [...prev];
            next[tempIdx] = msg;
            return next;
          }
          return [...prev, msg];
        });

        if (msg.receiver_id === user.id) {
          supabase.from('messages').update({ is_read: true }).eq('id', msg.id).then(() => {});
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, listingId, otherUserId]);

  if (!user) return (
    <div className="page" style={{ display: 'block', textAlign: 'center', padding: '6rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem', color: 'var(--muted)' }}>Please log in to view messages.</div>
      <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2.5rem' }} onClick={openAuthModal}>Login</button>
    </div>
  );

  const handleSend = async () => {
    if (!inputVal.trim() || !user || !otherUserId || !listingId) return;
    const content = inputVal.trim();
    const tempId = `temp-${Date.now()}`;
    setInputVal('');
    setSending(true);

    const tempMsg: Message = {
      id: tempId,
      sender_id: user.id,
      receiver_id: otherUserId,
      listing_id: listingId,
      content,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({ sender_id: user.id, receiver_id: otherUserId, listing_id: listingId, content, is_read: false })
        .select()
        .single();

      if (error || !data) {
        setMessages(prev => prev.filter(m => m.id !== tempId));
      } else {
        setMessages(prev => prev.map(m => m.id === tempId ? data : m));
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  const otherName = otherProfile?.username ? `@${otherProfile.username}` : 'User';
  const otherInitial = (otherProfile?.first_name ?? otherProfile?.username ?? '?').charAt(0).toUpperCase();
  const myInitial = (profile?.first_name ?? profile?.username ?? user.email ?? '?').charAt(0).toUpperCase();
  const myName = profile?.username ? `@${profile.username}` : 'You';

  return (
    <div className="page" style={{ display: 'block' }}>
      <div className="conv-layout">
        <div className="conv-header">
          <button className="conv-back" onClick={() => navigate('/inbox')}>← Back</button>
          <div className="conv-header-info">
            <div className="conv-other-name">{otherName}</div>
            {listing && (
              <Link to={`/item/${listing.id}`} className="conv-listing-link">
                {listing.title}
              </Link>
            )}
          </div>
          {listing && (
            <div className="conv-listing-thumb">
              {listing.photo_urls?.[0]
                ? <img src={listing.photo_urls[0]} alt={listing.title} />
                : <span>{listing.emoji || '👗'}</span>
              }
            </div>
          )}
        </div>

        <div className="conv-messages">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', padding: '2rem' }}>
              No messages yet — say hello!
            </div>
          )}
          {messages.map((msg, i) => {
            const isMine = msg.sender_id === user.id;
            const isTemp = msg.id.startsWith('temp-');
            const prevMsg = i > 0 ? messages[i - 1] : null;
            const nextMsg = i < messages.length - 1 ? messages[i + 1] : null;
            const grouped = prevMsg ? shouldGroup(prevMsg, msg) : false;
            const nextGrouped = nextMsg ? shouldGroup(msg, nextMsg) : false;
            const isLastInGroup = !nextGrouped;

            return (
              <div
                key={msg.id}
                className={`conv-msg-row ${isMine ? 'mine' : 'theirs'}`}
                style={{ marginBottom: nextGrouped ? '0.15rem' : '1rem' }}
              >
                <Avatar
                  avatarUrl={isMine ? profile?.avatar_url : otherProfile?.avatar_url}
                  initial={isMine ? myInitial : otherInitial}
                  hidden={grouped}
                />
                <div className="conv-msg-content">
                  {!grouped && (
                    <div className="conv-msg-sender">{isMine ? myName : otherName}</div>
                  )}
                  <div className={`conv-bubble${isTemp ? ' temp' : ''}`}>{msg.content}</div>
                  {isLastInGroup && (
                    <div className="conv-msg-time">{isTemp ? 'Sending…' : formatTime(new Date(msg.created_at))}</div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="conv-input-row">
          <input
            className="conv-input"
            type="text"
            placeholder="Type a message..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !sending && handleSend()}
          />
          <button className="conv-send" onClick={handleSend} disabled={sending}>Send</button>
        </div>
      </div>
    </div>
  );
}
