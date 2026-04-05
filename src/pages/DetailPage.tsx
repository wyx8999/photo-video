import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Bookmark, Share2, Send, ChevronLeft,
  MapPin, Camera as CameraIcon, Aperture, Clock, Zap, Maximize,
  Shield, Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw,
  Eye, Download, Flag, X
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store';
import { formatNumber, timeAgo } from '../lib/utils';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById, toggleLike, toggleSave, toggleFollow, addComment, toggleCommentLike, creators } = useAppStore();
  const item = getItemById(id || '');
  const creator = creators.find(c => c.id === item?.author.id);

  const [commentText, setCommentText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showFullImage, setShowFullImage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setProgress((v.currentTime / v.duration) * 100 || 0);
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, [item]);

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 text-center">
        <p className="text-text-muted">作品不存在</p>
        <button onClick={() => navigate('/')} className="mt-4 text-accent text-sm">返回首页</button>
      </div>
    );
  }

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) v.pause(); else v.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(!isMuted);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.5, 2, 0.5];
    const next = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    setPlaybackRate(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  const seekTo = (e: React.MouseEvent) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  };

  const handleSubmit = () => {
    if (commentText.trim()) {
      addComment(item.id, commentText.trim());
      setCommentText('');
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen?.();
    }
  };

  const exifItems = item.exif ? [
    { icon: CameraIcon, label: '相机', value: item.exif.camera },
    { icon: Maximize, label: '镜头', value: item.exif.lens },
    { icon: Aperture, label: '光圈', value: item.exif.aperture },
    { icon: Clock, label: '快门', value: item.exif.shutter },
    { icon: Zap, label: 'ISO', value: item.exif.iso },
    { icon: Maximize, label: '焦距', value: item.exif.focalLength },
  ].filter(e => e.value) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        返回
      </motion.button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Media column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 min-w-0"
        >
          {/* Media viewer */}
          <div className="relative rounded-xl overflow-hidden bg-black border border-border">
            {item.type === 'video' ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={item.src}
                  poster={item.thumbnail}
                  className="w-full max-h-[70vh] object-contain cursor-pointer"
                  loop playsInline muted={isMuted}
                  onClick={togglePlay}
                />
                {/* Video controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                  {/* Progress bar */}
                  <div
                    ref={progressRef}
                    className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer group"
                    onClick={seekTo}
                  >
                    <div
                      className="h-full bg-accent rounded-full relative transition-all"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={togglePlay} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" fill="white" />}
                      </button>
                      <button onClick={toggleMute} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                      </button>
                      <button onClick={cycleSpeed} className="px-2 py-1 rounded text-xs text-white/80 hover:bg-white/10 transition-colors font-mono">
                        {playbackRate}x
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { if (videoRef.current) { videoRef.current.currentTime = 0; } }} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <RotateCcw className="w-4 h-4 text-white" />
                      </button>
                      <button onClick={handleFullscreen} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={item.src}
                alt={item.title}
                className="w-full max-h-[70vh] object-contain cursor-zoom-in"
                onClick={() => setShowFullImage(true)}
              />
            )}
          </div>

          {/* Resolution info */}
          <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
            <span>{item.width} × {item.height}</span>
            {item.type === 'video' && <span>HD 1080p</span>}
            {item.copyright && <span>© {item.copyright}</span>}
          </div>

          {/* Title & description */}
          <div className="mt-6">
            <div className="flex items-start gap-2 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold flex-1" style={{ fontFamily: 'var(--font-display)' }}>
                {item.title}
              </h1>
              {item.isOriginal && (
                <span className="flex items-center gap-1 px-2 py-1 bg-accent-soft text-accent rounded-md text-xs font-medium flex-shrink-0">
                  <Shield className="w-3 h-3" />原创
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {item.tags.map(tag => (
              <button
                key={tag}
                onClick={() => { useAppStore.getState().setSearchQuery(tag); navigate('/'); }}
                className="px-2.5 py-1 text-xs bg-bg-elevated text-text-secondary rounded-lg hover:text-accent hover:bg-accent-soft transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* EXIF data */}
          {exifItems.length > 0 && (
            <div className="mt-6 p-4 bg-bg-card border border-border rounded-xl">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                <CameraIcon className="w-4 h-4 text-accent" />
                拍摄参数
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {exifItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-text-muted">{label}</p>
                      <p className="text-xs text-text-primary">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {item.location && (
            <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
              <MapPin className="w-4 h-4 text-accent" />
              {item.location}
            </div>
          )}

          {/* Comments section */}
          <div className="mt-8">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <MessageCircle className="w-4 h-4 text-accent" />
              评论 ({item.comments.length})
            </h3>

            {/* Comment input */}
            <div className="flex items-start gap-3 mb-6">
              <img src="/images/avatar1.jpg" alt="me" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1" />
              <div className="flex-1">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="写下你的评论..."
                  className="w-full px-4 py-3 bg-bg-input border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!commentText.trim()}
                className="p-3 bg-accent rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent-hover transition-colors flex-shrink-0 mt-0.5"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Comments list */}
            <div className="space-y-4">
              {item.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-text-primary">{comment.author}</span>
                      <span className="text-[10px] text-text-muted">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-text-secondary mt-0.5">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <button
                        onClick={() => toggleCommentLike(item.id, comment.id)}
                        className="flex items-center gap-1 text-xs text-text-muted hover:text-like transition-colors"
                      >
                        <Heart className={`w-3 h-3 ${comment.liked ? 'text-like fill-like' : ''}`} />
                        {comment.likes > 0 && comment.likes}
                      </button>
                      <button className="text-xs text-text-muted hover:text-text-secondary transition-colors">回复</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full lg:w-80 flex-shrink-0"
        >
          <div className="lg:sticky lg:top-20 space-y-4">
            {/* Actions bar */}
            <div className="flex items-center gap-2 p-3 bg-bg-card border border-border rounded-xl">
              <button
                onClick={() => toggleLike(item.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors ${
                  item.liked ? 'bg-like-soft text-like' : 'hover:bg-bg-elevated text-text-secondary'
                }`}
              >
                <motion.div whileTap={{ scale: 1.3 }}>
                  <Heart className={`w-5 h-5 ${item.liked ? 'fill-like' : ''}`} />
                </motion.div>
                <span className="text-sm font-medium">{formatNumber(item.likes)}</span>
              </button>
              <button
                onClick={() => toggleSave(item.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors ${
                  item.saved ? 'bg-accent-soft text-accent' : 'hover:bg-bg-elevated text-text-secondary'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${item.saved ? 'fill-accent' : ''}`} />
                <span className="text-sm font-medium">收藏</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-bg-elevated text-text-secondary transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">分享</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 px-4 py-3 bg-bg-card border border-border rounded-xl text-sm">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Eye className="w-4 h-4" />{formatNumber(item.views)} 浏览
              </span>
              <span className="flex items-center gap-1.5 text-text-secondary">
                <MessageCircle className="w-4 h-4" />{item.comments.length} 评论
              </span>
            </div>

            {/* Creator card */}
            <div className="p-4 bg-bg-card border border-border rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={item.author.avatar}
                  alt={item.author.name}
                  className="w-12 h-12 rounded-full object-cover cursor-pointer"
                  onClick={() => navigate(`/profile/${item.author.id}`)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-sm font-semibold cursor-pointer hover:text-accent transition-colors"
                      onClick={() => navigate(`/profile/${item.author.id}`)}
                    >
                      {item.author.name}
                    </span>
                    {item.author.isVerified && (
                      <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-text-muted">
                    Lv.{creator?.level || item.author.level} · {formatNumber(creator?.followers || item.author.followers)} 粉丝
                  </p>
                </div>
              </div>
              <p className="text-xs text-text-secondary line-clamp-2 mb-3">{creator?.bio || item.author.bio}</p>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFollow(item.author.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    (creator?.followed || item.author.followed)
                      ? 'bg-bg-elevated text-text-secondary border border-border'
                      : 'bg-accent text-white hover:bg-accent-hover'
                  }`}
                >
                  {(creator?.followed || item.author.followed) ? '已关注' : '+ 关注'}
                </motion.button>
                <button
                  onClick={() => navigate(`/profile/${item.author.id}`)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-bg-elevated text-text-secondary border border-border hover:bg-bg-hover transition-colors"
                >
                  主页
                </button>
              </div>
            </div>

            {/* More actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-bg-card border border-border rounded-xl text-xs text-text-muted hover:text-text-secondary transition-colors">
                <Download className="w-3.5 h-3.5" />下载
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-bg-card border border-border rounded-xl text-xs text-text-muted hover:text-text-secondary transition-colors">
                <Flag className="w-3.5 h-3.5" />举报
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full image lightbox */}
      <AnimatePresence>
        {showFullImage && item.type === 'photo' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center cursor-zoom-out"
            onClick={() => setShowFullImage(false)}
          >
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={item.src}
              alt={item.title}
              className="max-w-[95vw] max-h-[95vh] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
