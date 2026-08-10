import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { createPost, subscribeToPosts, updatePost, createNotification } from '../services/firebase';

const SocialContext = createContext(null);

const displayTime = (value) => {
  if (!value?.toDate) return 'Just now';
  return value.toDate().toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

export const SocialProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeFeedTab, setActiveFeedTab] = useState('all');
  const [filterShip, setFilterShip] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setError('');
    if (!currentUser?.sailingId) {
      setPosts([]);
      setIsLoading(false);
      return () => {};
    }

    return subscribeToPosts(currentUser.sailingId, (items) => {
      setPosts(items.map((post) => ({ ...post, timestamp: displayTime(post.createdAt), comments: post.comments || [], reactions: post.reactions || {}, userReaction: post.userReaction || null })));
      setIsLoading(false);
    }, (snapshotError) => {
      setError(snapshotError.message);
      setIsLoading(false);
    });
  }, [currentUser?.sailingId]);

  const addPost = async (newPostData, user) => {
    if (!user?.id || !user.sailingId) throw new Error('Link a sailing before posting.');
    await createPost({
      authorId: user.id,
      sailingId: user.sailingId,
      author: {
        name: user.name,
        handle: user.handle || '@cruiser',
        avatar: user.avatar || '/favicon.svg',
        loyaltyTier: user.loyaltyTier || 'Cruiser',
        ship: user.currentShipName || 'Current sailing'
      },
      shipTag: newPostData.shipTag || user.currentShipName,
      locationTag: newPostData.locationTag || user.location || '',
      content: newPostData.content.trim(),
      image: newPostData.image || null,
      reactions: { cheers: 0, anchor: 0, love: 0, wave: 0 },
      comments: []
    });
  };

  const toggleReaction = async (postId, type) => {
    const post = posts.find((item) => item.id === postId);
    if (!post || !currentUser) return;
    const reactions = { ...post.reactions };
    const previous = post.userReaction;
    if (previous) reactions[previous] = Math.max(0, (reactions[previous] || 0) - 1);
    const next = previous === type ? null : type;
    if (next) reactions[next] = (reactions[next] || 0) + 1;
    await updatePost(postId, { reactions, userReaction: next });
    if (next && post.authorId && post.authorId !== currentUser.id) await createNotification(post.authorId, { type: 'reaction', actorName: currentUser.name, text: `${currentUser.name} reacted to your sailing post.`, url: '/?tab=feed' });
  };

  const addComment = async (postId, commentText, user) => {
    if (!commentText.trim() || !user) return;
    const post = posts.find((item) => item.id === postId);
    if (!post) return;
    await updatePost(postId, {
      comments: [...(post.comments || []), {
        id: `comment_${Date.now()}`,
        authorId: user.id,
        name: user.name,
        avatar: user.avatar || '/favicon.svg',
        text: commentText.trim(),
        time: 'Just now'
      }]
    });
    if (post.authorId && post.authorId !== user.id) await createNotification(post.authorId, { type: 'comment', actorName: user.name, text: `${user.name} commented on your sailing post.`, url: '/?tab=feed' });
  };

  return (
    <SocialContext.Provider value={{ posts, addPost, toggleReaction, addComment, activeFeedTab, setActiveFeedTab, filterShip, setFilterShip, isLoading, error }}>
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => useContext(SocialContext);
