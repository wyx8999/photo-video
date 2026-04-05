import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Heart, Eye, TrendingUp, Crown, Medal } from 'lucide-react';
import { useAppStore } from '../store';
import { formatNumber } from '../lib/utils';
import { trendingTags } from '../data';

export default function RankingPage() {
  const navigate = useNavigate();
  const { getRankedCreators, items, toggleFollow, creators } = useAppStore();
  const rankedCreators = getRankedCreators();
  const topWorks = [...items].sort((a, b) => b.likes - a.likes).slice(0, 10);

  const medalColors = ['text-warn', 'text-text-secondary', 'text-orange-700'];
  const medalIcons = [Crown, Medal, Medal];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="bg-gradient-to-r from-warn via-orange-400 to-accent bg-clip-text text-transparent">排行榜</span>
        </h1>
        <p className="text-sm text-text-secondary">发现最受欢迎的创作者和作品</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Creator ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-5 h-5 text-warn" />
            <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>创作者榜</h2>
          </div>

          <div className="space-y-2">
            {rankedCreators.map((creator, i) => {
              const c = creators.find(cc => cc.id === creator.id) || creator;
              const MedalIcon = i < 3 ? medalIcons[i] : null;
              return (
                <motion.div
                  key={creator.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-elevated transition-colors cursor-pointer group"
                  onClick={() => navigate(`/profile/${creator.id}`)}
                >
                  <div className="w-6 flex justify-center">
                    {MedalIcon ? (
                      <MedalIcon className={`w-5 h-5 ${medalColors[i]}`} />
                    ) : (
                      <span className="text-sm font-bold text-text-muted">{i + 1}</span>
                    )}
                  </div>
                  <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium group-hover:text-accent transition-colors">{creator.name}</span>
                      {creator.isVerified && (
                        <div className="w-3.5 h-3.5 rounded-full bg-accent flex items-center justify-center">
                          <span className="text-[7px] text-white font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-text-muted mt-0.5">
                      <span className="flex items-center gap-0.5"><Heart className="w-2.5 h-2.5" />{formatNumber(creator.totalLikes)}</span>
                      <span>Lv.{creator.level}</span>
                      <span>{formatNumber(c.followers)} 粉丝</span>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); toggleFollow(creator.id); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      c.followed
                        ? 'bg-bg-elevated text-text-muted border border-border'
                        : 'bg-accent text-white hover:bg-accent-hover'
                    }`}
                  >
                    {c.followed ? '已关注' : '关注'}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Works ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>作品榜</h2>
          </div>

          <div className="space-y-2">
            {topWorks.map((work, i) => {
              const MedalIcon = i < 3 ? medalIcons[i] : null;
              return (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg-elevated transition-colors cursor-pointer group"
                  onClick={() => navigate(`/detail/${work.id}`)}
                >
                  <div className="w-6 flex justify-center">
                    {MedalIcon ? (
                      <MedalIcon className={`w-5 h-5 ${medalColors[i]}`} />
                    ) : (
                      <span className="text-sm font-bold text-text-muted">{i + 1}</span>
                    )}
                  </div>
                  <img
                    src={work.type === 'video' ? work.thumbnail || work.src : work.src}
                    alt={work.title}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-accent transition-colors truncate">{work.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <img src={work.author.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                      <span className="text-[10px] text-text-muted">{work.author.name}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-like flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-like" />{formatNumber(work.likes)}
                    </p>
                    <p className="text-[10px] text-text-muted flex items-center gap-1 justify-end">
                      <Eye className="w-2.5 h-2.5" />{formatNumber(work.views)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Trending tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-success" />
          <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>热门标签</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag, i) => (
            <motion.button
              key={tag.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.03 }}
              onClick={() => { useAppStore.getState().setSearchQuery(tag.name); navigate('/'); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                i < 3 ? 'bg-accent-soft text-accent border border-accent/20' : 'bg-bg-elevated text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              #{tag.name}
              <span className="ml-2 text-xs opacity-60">{formatNumber(tag.count)}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
