import { TrendingUp, ChevronRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { trendingTags } from '../data';
import { useAppStore } from '../store';
import { formatNumber } from '../lib/utils';

export default function TrendingSidebar() {
  const navigate = useNavigate();
  const { setSearchQuery, setCategory, getRankedCreators } = useAppStore();
  const topCreators = getRankedCreators().slice(0, 5);

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setCategory('全部');
  };

  return (
    <div className="space-y-6">
      {/* Trending tags */}
      <div className="bg-bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>热门标签</h3>
        </div>
        <div className="space-y-1">
          {trendingTags.map((tag, i) => (
            <motion.button
              key={tag.name}
              whileHover={{ x: 4 }}
              onClick={() => handleTagClick(tag.name)}
              className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-bg-elevated transition-colors group"
            >
              <span className={`w-5 text-xs font-bold ${
                i < 3 ? 'text-accent' : 'text-text-muted'
              }`}>{i + 1}</span>
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors flex-1 text-left">#{tag.name}</span>
              <span className="text-[10px] text-text-muted">{formatNumber(tag.count)}个作品</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Top creators */}
      <div className="bg-bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-warn" />
            <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>创作者榜</h3>
          </div>
          <button
            onClick={() => navigate('/ranking')}
            className="flex items-center gap-0.5 text-xs text-accent hover:text-accent-hover transition-colors"
          >
            查看全部 <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {topCreators.map((creator, i) => (
            <motion.button
              key={creator.id}
              whileHover={{ x: 4 }}
              onClick={() => navigate(`/profile/${creator.id}`)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-bg-elevated transition-colors"
            >
              <span className={`w-5 text-xs font-bold ${
                i === 0 ? 'text-warn' : i === 1 ? 'text-text-secondary' : i === 2 ? 'text-orange-700' : 'text-text-muted'
              }`}>{i + 1}</span>
              <img src={creator.avatar} alt={creator.name} className="w-8 h-8 rounded-full object-cover" />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm text-text-primary truncate">{creator.name}</p>
                <p className="text-[10px] text-text-muted">{formatNumber(creator.totalLikes)} 获赞</p>
              </div>
              {creator.isVerified && (
                <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] text-white font-bold">✓</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-2 py-4">
        <p className="text-xs text-text-muted">光影集 · 用镜头发现世界之美</p>
        <div className="flex items-center justify-center gap-3 text-[10px] text-text-muted">
          <span className="hover:text-text-secondary cursor-pointer">关于我们</span>
          <span>·</span>
          <span className="hover:text-text-secondary cursor-pointer">使用条款</span>
          <span>·</span>
          <span className="hover:text-text-secondary cursor-pointer">隐私政策</span>
        </div>
      </div>
    </div>
  );
}
