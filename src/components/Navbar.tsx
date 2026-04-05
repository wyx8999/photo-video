import { Search, Upload, Bell, Menu, X, Camera, TrendingUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setSearchQuery, setCategory } = useAppStore();

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearch = () => {
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setCategory('全部');
      navigate('/');
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  const goHome = () => {
    setSearchQuery('');
    setCategory('全部');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/75 backdrop-blur-2xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goHome}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center shadow-lg shadow-accent-glow">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block" style={{ fontFamily: 'var(--font-display)' }}>
              光影<span className="text-accent">集</span>
            </span>
          </motion.div>

          {/* Center nav links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {[{ path: '/', label: '发现' }, { path: '/ranking', label: '排行榜' }, { path: '/upload', label: '投稿' }].map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-accent bg-accent-soft'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
            >
              <Search className="w-5 h-5 text-text-secondary" />
            </motion.button>

            {/* Notification */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg hover:bg-bg-elevated transition-colors hidden sm:flex"
            >
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-like rounded-full" />
            </motion.button>

            {/* Upload CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/upload')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>投稿</span>
            </motion.button>

            {/* Avatar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/profile/c1')}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-accent transition-colors flex-shrink-0"
            >
              <img src="/images/avatar1.jpg" alt="me" className="w-full h-full object-cover" />
            </motion.button>

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-bg-elevated"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border bg-bg/95 backdrop-blur-2xl"
          >
            <div className="max-w-2xl mx-auto px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  ref={searchRef}
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="搜索作品、创作者、标签、地点..."
                  className="w-full pl-10 pr-20 py-3 bg-bg-input border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-medium transition-colors"
                >
                  搜索
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-bg/95 backdrop-blur-2xl"
          >
            <div className="p-4 space-y-2">
              {[{ path: '/', label: '发现', icon: Search }, { path: '/ranking', label: '排行榜', icon: TrendingUp }, { path: '/upload', label: '投稿', icon: Upload }, { path: '/profile/c1', label: '我的', icon: User }].map(item => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.path) ? 'text-accent bg-accent-soft' : 'text-text-secondary hover:bg-bg-elevated'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
