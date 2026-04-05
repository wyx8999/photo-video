import { motion } from 'framer-motion';
import { Clock, Flame, Heart } from 'lucide-react';
import type { SortMode } from '../types';
import { categories } from '../data';

interface FilterBarProps {
  activeCategory: string;
  onCategoryChange: (c: string) => void;
  sortMode: SortMode;
  onSortChange: (m: SortMode) => void;
  resultCount: number;
}

const sortOptions: { mode: SortMode; label: string; icon: typeof Clock }[] = [
  { mode: 'latest', label: '最新', icon: Clock },
  { mode: 'hottest', label: '最热', icon: Flame },
  { mode: 'mostLiked', label: '最多赞', icon: Heart },
];

export default function FilterBar({ activeCategory, onCategoryChange, sortMode, onSortChange, resultCount }: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Categories */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {categories.map((c) => (
          <motion.button
            key={c}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onCategoryChange(c)}
            className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === c ? 'text-white' : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            }`}
          >
            {activeCategory === c && (
              <motion.div
                layoutId="activeCat"
                className="absolute inset-0 bg-accent rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{c}</span>
          </motion.button>
        ))}
      </div>

      {/* Sort + count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          共 <span className="text-text-primary font-medium">{resultCount}</span> 个作品
        </p>
        <div className="flex items-center gap-1 bg-bg-card border border-border rounded-lg p-0.5">
          {sortOptions.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => onSortChange(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                sortMode === mode
                  ? 'bg-bg-elevated text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
