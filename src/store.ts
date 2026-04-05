import { create } from 'zustand';
import type { MediaItem, Creator, Comment, SortMode } from './types';
import { mediaItems as initialItems, creators as initialCreators } from './data';

interface AppState {
  items: MediaItem[];
  creators: Creator[];
  category: string;
  searchQuery: string;
  sortMode: SortMode;
  // actions
  setCategory: (c: string) => void;
  setSearchQuery: (q: string) => void;
  setSortMode: (m: SortMode) => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  toggleCommentLike: (itemId: string, commentId: string) => void;
  addComment: (id: string, text: string) => void;
  toggleFollow: (creatorId: string) => void;
  getFilteredItems: () => MediaItem[];
  getItemById: (id: string) => MediaItem | undefined;
  getCreatorById: (id: string) => Creator | undefined;
  getCreatorItems: (creatorId: string) => MediaItem[];
  getRankedCreators: () => Creator[];
}

export const useAppStore = create<AppState>((set, get) => ({
  items: initialItems,
  creators: initialCreators,
  category: '全部',
  searchQuery: '',
  sortMode: 'latest',

  setCategory: (c) => set({ category: c }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSortMode: (m) => set({ sortMode: m }),

  toggleLike: (id) => set((s) => ({
    items: s.items.map(item =>
      item.id === id
        ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 }
        : item
    ),
  })),

  toggleSave: (id) => set((s) => ({
    items: s.items.map(item =>
      item.id === id ? { ...item, saved: !item.saved } : item
    ),
  })),

  toggleCommentLike: (itemId, commentId) => set((s) => ({
    items: s.items.map(item =>
      item.id === itemId
        ? {
            ...item,
            comments: item.comments.map(c =>
              c.id === commentId
                ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
                : c
            ),
          }
        : item
    ),
  })),

  addComment: (id, text) => {
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      author: '我',
      avatar: '/images/avatar1.jpg',
      text,
      createdAt: Date.now(),
      likes: 0,
      liked: false,
    };
    set((s) => ({
      items: s.items.map(item =>
        item.id === id ? { ...item, comments: [newComment, ...item.comments] } : item
      ),
    }));
  },

  toggleFollow: (creatorId) => set((s) => ({
    creators: s.creators.map(c =>
      c.id === creatorId
        ? { ...c, followed: !c.followed, followers: c.followed ? c.followers - 1 : c.followers + 1 }
        : c
    ),
    items: s.items.map(item =>
      item.author.id === creatorId
        ? { ...item, author: { ...item.author, followed: !item.author.followed, followers: item.author.followed ? item.author.followers - 1 : item.author.followers + 1 } }
        : item
    ),
  })),

  getFilteredItems: () => {
    const { items, category, searchQuery, sortMode } = get();
    let filtered = [...items];

    if (category !== '全部') {
      if (category === '视频') {
        filtered = filtered.filter(i => i.type === 'video');
      } else {
        filtered = filtered.filter(i => i.category === category || i.tags.includes(category));
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.author.name.toLowerCase().includes(q) ||
        i.tags.some(t => t.includes(q)) ||
        i.description.toLowerCase().includes(q) ||
        (i.location && i.location.toLowerCase().includes(q))
      );
    }

    switch (sortMode) {
      case 'latest': filtered.sort((a, b) => b.createdAt - a.createdAt); break;
      case 'hottest': filtered.sort((a, b) => b.views - a.views); break;
      case 'mostLiked': filtered.sort((a, b) => b.likes - a.likes); break;
    }

    return filtered;
  },

  getItemById: (id) => get().items.find(i => i.id === id),
  getCreatorById: (id) => get().creators.find(c => c.id === id),
  getCreatorItems: (creatorId) => get().items.filter(i => i.author.id === creatorId),
  getRankedCreators: () => [...get().creators].sort((a, b) => b.totalLikes - a.totalLikes),
}));
