import { Heart, MessageCircle, Bookmark, Play, Eye, MapPin, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MediaItem } from '../types';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatNumber, timeAgo } from '../lib/utils';
import LazyImage from './LazyImage';

interface MediaCardProps {
  item: MediaItem;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  index: number;
}

export default function MediaCard({ item, onLike, onSave, index }: MediaCardProps) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setHovered(true);
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const goDetail = () => navigate(`/detail/${item.id}`);
  const goProfile = (e: React.MouseEvent) => { e.stopPropagation(); navigate(`/profile/${item.author.id}`); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4) }}
      className="masonry-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="group relative rounded-xl overflow-hidden bg-bg-card border border-border hover:border-border-light transition-all duration-300 cursor-pointer">
        {/* Media area */}
        <div className="relative overflow-hidden" onClick={goDetail}>
          {item.type === 'video' ? (
            <>
              <LazyImage
                src={item.thumbnail || item.src}
                alt={item.title}
                className={`w-full object-cover transition-all duration-500 ${hovered ? 'opacity-0 scale-105' : 'opacity-100'}`}
              />
              <video
                ref={videoRef}
                src={item.src}
                muted loop playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`}
              />
              {!hovered && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                  </div>
                </div>
              )}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                视频
              </div>
            </>
          ) : (
            <LazyImage
              src={item.src}
              alt={item.title}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          )}

          {/* Original badge */}
          {item.isOriginal && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 bg-accent/90 backdrop-blur-sm rounded text-[10px] text-white font-medium">
              <Shield className="w-2.5 h-2.5" />
              原创
            </div>
          )}

          {/* Hover overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
          />

          {/* Hover actions */}
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-white/90 text-xs">
                <Eye className="w-3 h-3" />{formatNumber(item.views)}
              </span>
              <span className="flex items-center gap-1 text-white/90 text-xs">
                <MessageCircle className="w-3 h-3" />{item.comments.length}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onSave(item.id); }}
              className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                item.saved ? 'bg-accent text-white' : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={item.saved ? 'currentColor' : 'none'} />
            </button>
          </motion.div>
        </div>

        {/* Card info */}
        <div className="p-2.5 sm:p-3">
          <h3 className="text-sm font-medium text-text-primary line-clamp-1 mb-1.5">{item.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={goProfile}>
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
              <span className="text-xs text-text-muted truncate">{item.author.name}</span>
              {item.author.isVerified && (
                <div className="w-3.5 h-3.5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] text-white font-bold">✓</span>
                </div>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onLike(item.id); }}
              className="flex items-center gap-1 group/like flex-shrink-0"
            >
              <motion.div whileTap={{ scale: 1.4 }} transition={{ type: 'spring', stiffness: 500 }}>
                <Heart
                  className={`w-3.5 h-3.5 transition-colors ${
                    item.liked ? 'text-like fill-like' : 'text-text-muted group-hover/like:text-like'
                  }`}
                />
              </motion.div>
              <span className={`text-xs ${item.liked ? 'text-like' : 'text-text-muted'}`}>
                {formatNumber(item.likes)}
              </span>
            </button>
          </div>

          {/* Location & time */}
          {item.location && (
            <div className="flex items-center gap-1 mt-2 text-[10px] text-text-muted">
              <MapPin className="w-2.5 h-2.5" />
              <span className="truncate">{item.location}</span>
              <span className="mx-1">·</span>
              <span className="flex-shrink-0">{timeAgo(item.createdAt)}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
