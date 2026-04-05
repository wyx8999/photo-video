import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, MapPin, Link as LinkIcon, Calendar, Award,
  Heart, Eye, Image, Film, Settings, Share2, Grid, Bookmark
} from 'lucide-react';
import { useAppStore } from '../store';
import { formatNumber } from '../lib/utils';
import MediaCard from '../components/MediaCard';
import { useState } from 'react';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCreatorItems, toggleFollow, toggleLike, toggleSave, creators } = useAppStore();
  const creator = creators.find(c => c.id === id);
  const items = getCreatorItems(id || '');
  const [tab, setTab] = useState<'works' | 'saved'>('works');

  if (!creator) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 text-center">
        <p className="text-text-muted">用户不存在</p>
        <button onClick={() => navigate('/')} className="mt-4 text-accent text-sm">返回首页</button>
      </div>
    );
  }

  const photoCount = items.filter(i => i.type === 'photo').length;
  const videoCount = items.filter(i => i.type === 'video').length;
  const totalViews = items.reduce((s, i) => s + i.views, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16">
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        返回
      </motion.button>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-card border border-border rounded-2xl overflow-hidden"
      >
        {/* Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-accent/30 via-purple/20 to-info/30 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,106,58,0.2),transparent_60%)]" />
        </div>

        <div className="px-4 sm:px-6 pb-6">
          {/* Avatar + follow */}
          <div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-4">
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-bg-card shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-lg">
                <span className="text-[10px] text-white font-bold">Lv.{creator.level}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl bg-bg-elevated border border-border hover:bg-bg-hover transition-colors">
                <Share2 className="w-4 h-4 text-text-secondary" />
              </button>
              {id === 'c1' ? (
                <button className="px-4 py-2.5 rounded-xl bg-bg-elevated border border-border text-sm font-medium text-text-secondary hover:bg-bg-hover transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" />编辑资料
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFollow(creator.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    creator.followed
                      ? 'bg-bg-elevated text-text-secondary border border-border'
                      : 'bg-accent text-white hover:bg-accent-hover'
                  }`}
                >
                  {creator.followed ? '已关注' : '+ 关注'}
                </motion.button>
              )}
            </div>
          </div>

          {/* Name & bio */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                {creator.name}
              </h1>
              {creator.isVerified && (
                <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">✓</span>
                </div>
              )}
            </div>
            <p className="text-sm text-text-secondary max-w-lg">{creator.bio}</p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted mb-5">
            {creator.location && (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{creator.location}</span>
            )}
            {creator.website && (
              <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3" />{creator.website}</span>
            )}
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{creator.joinedAt} 加入</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {creator.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 text-xs bg-bg-elevated text-text-secondary rounded-lg">#{tag}</span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: '关注者', value: formatNumber(creator.followers), icon: Heart, color: 'text-like' },
              { label: '关注', value: formatNumber(creator.following), icon: Award, color: 'text-info' },
              { label: '照片', value: photoCount, icon: Image, color: 'text-info' },
              { label: '视频', value: videoCount, icon: Film, color: 'text-purple' },
              { label: '总浏览', value: formatNumber(totalViews), icon: Eye, color: 'text-success' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-2.5 p-3 bg-bg-elevated rounded-xl">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <div>
                  <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</p>
                  <p className="text-[10px] text-text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mt-6 mb-6 bg-bg-card border border-border rounded-xl p-1">
        {[
          { key: 'works' as const, label: '作品', icon: Grid, count: items.length },
          { key: 'saved' as const, label: '收藏', icon: Bookmark, count: 0 },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-bg-elevated text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
            <span className="text-xs opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Works grid */}
      {tab === 'works' && items.length > 0 && (
        <div className="masonry-grid">
          {items.map((item, i) => (
            <MediaCard
              key={item.id}
              item={item}
              onLike={toggleLike}
              onSave={toggleSave}
              index={i}
            />
          ))}
        </div>
      )}

      {tab === 'saved' && (
        <div className="text-center py-16">
          <Bookmark className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-muted">暂无收藏内容</p>
        </div>
      )}
    </div>
  );
}
