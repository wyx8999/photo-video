import { motion } from 'framer-motion';
import { Sparkles, Camera, Image, Film } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import FilterBar from '../components/FilterBar';
import TrendingSidebar from '../components/TrendingSidebar';
import { useAppStore } from '../store';

export default function HomePage() {
  const {
    category, setCategory, sortMode, setSortMode,
    toggleLike, toggleSave, getFilteredItems, searchQuery,
  } = useAppStore();

  const items = getFilteredItems();
  const photoCount = items.filter(i => i.type === 'photo').length;
  const videoCount = items.filter(i => i.type === 'video').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16">
      {/* Hero - only show if no search */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-soft border border-accent/20 rounded-full text-accent text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3" />
            每日精选推荐
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            记录生活
            <span className="bg-gradient-to-r from-accent via-orange-400 to-amber-400 bg-clip-text text-transparent">
              {' '}分享美好
            </span>
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mb-6">
            在这里，每一张照片都是一个故事，每一段视频都是一次旅程
          </p>
          {/* Quick stats */}
          <div className="inline-flex items-center gap-6 px-5 py-2.5 bg-bg-card border border-border rounded-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-info-soft"><Image className="w-3.5 h-3.5 text-info" /></div>
              <div className="text-left">
                <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>{photoCount}</p>
                <p className="text-[10px] text-text-muted">照片</p>
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-purple-soft"><Film className="w-3.5 h-3.5 text-purple" /></div>
              <div className="text-left">
                <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>{videoCount}</p>
                <p className="text-[10px] text-text-muted">视频</p>
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-accent-soft"><Camera className="w-3.5 h-3.5 text-accent" /></div>
              <div className="text-left">
                <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>8</p>
                <p className="text-[10px] text-text-muted">创作者</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search results header */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            搜索“<span className="text-accent">{searchQuery}</span>”的结果
          </h2>
        </motion.div>
      )}

      {/* Main content + sidebar */}
      <div className="flex gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <FilterBar
              activeCategory={category}
              onCategoryChange={setCategory}
              sortMode={sortMode}
              onSortChange={setSortMode}
              resultCount={items.length}
            />
          </motion.div>

          {items.length > 0 ? (
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
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="w-16 h-16 rounded-full bg-bg-card border border-border flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-text-muted" />
              </div>
              <p className="text-base font-medium text-text-primary mb-1">没有找到相关作品</p>
              <p className="text-sm text-text-muted">试试其他搜索词或切换分类</p>
            </motion.div>
          )}
        </div>

        {/* Sidebar - desktop only */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-20">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
