import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { useCruise } from '../../context/CruiseContext';
import { useAuth } from '../../context/AuthContext';
import { Image, MapPin, Send, Heart, Anchor, Waves, GlassWater, Ship, Sparkles, Plus } from '../Icons';

export const SocialFeed = () => {
  const { posts, addPost, toggleReaction, addComment, activeFeedTab, setActiveFeedTab } = useSocial();
  const { activeShip, currentDeckLocation, venues } = useCruise();
  const { currentUser, setIsAuthModalOpen } = useAuth();

  const [postContent, setPostContent] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(currentDeckLocation);
  const [photoUrl, setPhotoUrl] = useState('/deck_lounge.jpg');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  const samplePhotos = [
    '/hero_banner.jpg',
    '/deck_lounge.jpg',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80'
  ];

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    addPost({
      content: postContent,
      locationTag: selectedVenue,
      image: photoUrl || null,
      shipTag: currentUser.currentShipName || activeShip.name
    }, currentUser);

    setPostContent('');
    setPhotoUrl('/deck_lounge.jpg');
    setShowPhotoInput(false);
  };

  const handleCommentSubmit = (postId, e) => {
    e.preventDefault();
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    addComment(postId, text, currentUser);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts = posts.filter(post => {
    if (activeFeedTab === 'sailing') return post.shipTag === activeShip.name;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Hero Banner Header */}
      <div className="sailing-hero-card" style={{ backgroundImage: `url('/hero_banner.jpg')` }}>
        <div className="sailing-hero-overlay" />
        <div className="sailing-hero-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.82rem', padding: '4px 12px' }}>
              🚢 {activeShip.name}
            </span>
            <span className="badge badge-teal" style={{ fontSize: '0.82rem' }}>
              📍 {activeShip.homePort}
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
            {activeShip.currentVoyage}
          </h1>
          <p style={{ color: '#e2e8f0', fontSize: '0.9rem', marginTop: '6px', maxWidth: '600px' }}>
            Real-time social media feed for active sailors onboard {activeShip.name}!
          </p>
        </div>
      </div>

      {/* Create Post Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
          <img 
            src={currentUser?.avatar || '/favicon.svg'} 
            alt={currentUser?.name || 'Cruiser'}
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284c7' }}
          />
          <div style={{ flex: 1 }}>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={currentUser ? `What's happening on ${activeShip.name}? Share sea photos, port tips, or sail-away vibes...` : "Sign in to post sea stories & connect with shipmates..."}
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
              }}
              style={{
                width: '100%',
                minHeight: '84px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass)',
                borderRadius: '14px',
                padding: '12px',
                color: '#fff',
                resize: 'none',
                fontSize: '0.92rem'
              }}
            />
          </div>
        </div>

        {/* Photo selector */}
        {showPhotoInput && (
          <div style={{ marginBottom: '14px' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Pick a high-res sea photo or paste URL:</p>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {samplePhotos.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="Sample"
                  onClick={() => setPhotoUrl(url)}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: photoUrl === url ? '2px solid #38bdf8' : '1px solid transparent'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setShowPhotoInput(!showPhotoInput)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: showPhotoInput ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: showPhotoInput ? '#38bdf8' : '#94a3b8',
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <Image size={15} />
              <span>Photo</span>
            </button>

            {/* Venue Tag Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: '999px' }}>
              <MapPin size={14} className="text-teal-400" />
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#e2e8f0',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {venues.map(v => (
                  <option key={v.id} value={`${v.name} - ${v.deck}`} style={{ background: '#0f172a' }}>
                    {v.name} ({v.deck})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCreatePost}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 22px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)'
            }}
          >
            <Send size={15} />
            <span>Post Story</span>
          </button>
        </div>
      </div>

      {/* Feed Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveFeedTab('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              background: activeFeedTab === 'all' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: activeFeedTab === 'all' ? '#38bdf8' : '#94a3b8',
              border: activeFeedTab === 'all' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            All Sailings
          </button>
          <button
            onClick={() => setActiveFeedTab('sailing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: activeFeedTab === 'sailing' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: activeFeedTab === 'sailing' ? '#38bdf8' : '#94a3b8',
              border: activeFeedTab === 'sailing' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            <Ship size={14} />
            <span>{activeShip.name}</span>
          </button>
        </div>

        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{filteredPosts.length} Active Posts</span>
      </div>

      {/* Empty State Card if 0 Posts */}
      {filteredPosts.length === 0 && (
        <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <Sparkles size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>No Sea Stories Yet</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '420px', lineHeight: '1.5' }}>
            Be the very first sailor to share a photo, post a port recommendation, or start the sail-away party for {activeShip.name}!
          </p>
        </div>
      )}

      {/* Feed Posts Listing */}
      {filteredPosts.map(post => (
        <div key={post.id} className="glass-panel post-card">
          <div className="post-header">
            <div className="post-author-info">
              <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                  {post.author.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span className="badge badge-gold">{post.author.loyaltyTier}</span>
                  <span>•</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-ocean" style={{ fontSize: '0.7rem' }}>{post.shipTag}</span>
            </div>
          </div>

          {/* Location Badge */}
          {post.locationTag && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#2dd4bf', background: 'rgba(20, 184, 166, 0.12)', padding: '3px 10px', borderRadius: '999px', marginBottom: '10px' }}>
              <MapPin size={12} />
              <span>{post.locationTag}</span>
            </div>
          )}

          <p style={{ color: '#f1f5f9', fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </p>

          {post.image && (
            <div className="post-image-container">
              <img src={post.image} alt="Cruise memory" className="post-image" />
            </div>
          )}

          {/* Nautical Reactions */}
          <div className="post-actions">
            <button
              onClick={() => toggleReaction(post.id, 'cheers')}
              className={`reaction-btn ${post.userReaction === 'cheers' ? 'active' : ''}`}
            >
              <GlassWater size={15} />
              <span>Cheers ({post.reactions.cheers || 0})</span>
            </button>

            <button
              onClick={() => toggleReaction(post.id, 'anchor')}
              className={`reaction-btn ${post.userReaction === 'anchor' ? 'active' : ''}`}
            >
              <Anchor size={15} />
              <span>Anchor ({post.reactions.anchor || 0})</span>
            </button>

            <button
              onClick={() => toggleReaction(post.id, 'love')}
              className={`reaction-btn ${post.userReaction === 'love' ? 'active' : ''}`}
            >
              <Heart size={15} />
              <span>Love ({post.reactions.love || 0})</span>
            </button>

            <button
              onClick={() => toggleReaction(post.id, 'wave')}
              className={`reaction-btn ${post.userReaction === 'wave' ? 'active' : ''}`}
            >
              <Waves size={15} />
              <span>Ahoy ({post.reactions.wave || 0})</span>
            </button>
          </div>

          {/* Comments List */}
          {post.comments && post.comments.length > 0 && (
            <div className="comments-list">
              {post.comments.map(c => (
                <div key={c.id} className="comment-item">
                  <img src={c.avatar} alt={c.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <span style={{ fontWeight: 700, color: '#e2e8f0', marginRight: '6px' }}>{c.name}:</span>
                    <span style={{ color: '#cbd5e1' }}>{c.text}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Write comment input */}
          <form onSubmit={(e) => handleCommentSubmit(post.id, e)} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentInputs[post.id] || ''}
              onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '999px',
                padding: '6px 14px',
                color: '#fff',
                fontSize: '0.82rem'
              }}
            />
            <button
              type="submit"
              style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              Reply
            </button>
          </form>
        </div>
      ))}
    </div>
  );
};
