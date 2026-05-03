import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  listingId: string;
  otherUserId: string;
  latestMessage: Message;
  unreadCount: number;
  listing?: { id: string | number; title: string; photo_urls?: string[]; emoji?: string };
  otherProfile?: { username: string; first_name?: string | null };
}

function formatTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'now';
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

export default function Inbox() {
  const { user, loading: authLoading } = useAuth();
  const { openAuthModal } = useUI();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const filterListing = searchParams.get('listing');

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    async function load() {
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
        .order('created_at', { ascending: false });

      if (!messages) { setLoading(false); return; }

      const convMap = new Map<string, Conversation>();
      for (const msg of messages) {
        const otherUserId = msg.sender_id === user!.id ? msg.receiver_id : msg.sender_id;
        const key = `${msg.listing_id}::${otherUserId}`;
        if (!convMap.has(key)) {
          convMap.set(key, { listingId: msg.listing_id, otherUserId, latestMessage: msg, unreadCount: 0 });
        }
        if (msg.receiver_id === user!.id && !msg.is_read) {
          convMap.get(key)!.unreadCount++;
        }
      }

      let convList = Array.from(convMap.values());
      if (filterListing) convList = convList.filter(c => c.listingId === filterListing);

      const listingIds = [...new Set(convList.map(c => c.listingId))];
      const otherIds = [...new Set(convList.map(c => c.otherUserId))];

      const [{ data: listings }, { data: profiles }] = await Promise.all([
        supabase.from('listings').select('id, title, photo_urls, emoji').in('id', listingIds),
        supabase.from('profiles').select('id, username, first_name').in('id', otherIds),
      ]);

      setConversations(convList.map(c => ({
        ...c,
        listing: listings?.find(l => String(l.id) === c.listingId),
        otherProfile: profiles?.find(p => p.id === c.otherUserId),
      })));
      setLoading(false);
    }

    load();
  }, [user, filterListing]);

  if (authLoading || loading) return (
    <div className="page" style={{ display: 'block', textAlign: 'center', padding: '4rem' }}>Loading...</div>
  );

  if (!user) return (
    <div className="page" style={{ display: 'block', textAlign: 'center', padding: '6rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem', color: 'var(--muted)' }}>Please log in to see your messages.</div>
      <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2.5rem' }} onClick={openAuthModal}>Login</button>
    </div>
  );

  return (
    <div className="page" style={{ display: 'block' }}>
      <div className="inbox-layout">
        <div className="inbox-header">
          <div className="inbox-title">Inbox</div>
          {filterListing && (
            <button className="inbox-clear-filter" onClick={() => navigate('/inbox')}>
              ← All messages
            </button>
          )}
        </div>

        {conversations.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">💬</div>
            <div className="empty-title">No Messages Yet</div>
            <div className="empty-text">Start a conversation by messaging a seller on a listing.</div>
          </div>
        ) : (
          <div className="inbox-list">
            {conversations.map(conv => {
              const photo = conv.listing?.photo_urls?.[0];
              const otherName = conv.otherProfile?.username ? `@${conv.otherProfile.username}` : 'User';
              return (
                <Link
                  key={`${conv.listingId}::${conv.otherUserId}`}
                  to={`/inbox/${conv.listingId}/${conv.otherUserId}`}
                  className={`inbox-row${conv.unreadCount > 0 ? ' unread' : ''}`}
                >
                  <div className="inbox-row-img">
                    {photo
                      ? <img src={photo} alt="" />
                      : <span>{conv.listing?.emoji || '👗'}</span>
                    }
                  </div>
                  <div className="inbox-row-body">
                    <div className="inbox-row-top">
                      <span className="inbox-row-name">{otherName}</span>
                      <span className="inbox-row-time">{formatTime(new Date(conv.latestMessage.created_at))}</span>
                    </div>
                    <div className="inbox-row-listing">{conv.listing?.title || 'Listing'}</div>
                    <div className="inbox-row-preview">{conv.latestMessage.content}</div>
                  </div>
                  {conv.unreadCount > 0 && <div className="inbox-unread-dot" />}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
