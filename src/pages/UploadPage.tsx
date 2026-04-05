import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload, Image, Film, X, MapPin, Tag, FileText,
  ChevronLeft, Check, Shield, Info
} from 'lucide-react';

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [isOriginal, setIsOriginal] = useState(true);
  const [copyright, setCopyright] = useState('CC BY-NC 4.0');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | File[]) => {
    const fileArr = Array.from(newFiles).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    setFiles(prev => [...prev, ...fileArr]);
    fileArr.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviews(prev => [...prev, e.target?.result as string]);
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => [...prev, '']);
      }
    });
  };

  const removeFile = (i: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
      setTimeout(() => navigate('/'), 2000);
    }, 2500);
  };

  const categories = ['风光', '城市', '人像', '美食', '旅行', '自然', '宠物', '建筑', '艺术', '生活', '天文'];
  const copyrightOptions = ['All Rights Reserved', 'CC BY 4.0', 'CC BY-NC 4.0', 'CC BY-NC-ND 4.0', 'CC0 公共领域'];

  if (uploaded) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-32 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-full bg-success-soft flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>发布成功！</h2>
          <p className="text-text-secondary text-sm">你的作品已提交审核，很快将与大家见面</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16">
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        返回
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>投稿作品</h1>
        <p className="text-sm text-text-muted mb-8">分享你的摄影作品，让更多人看到你的才华</p>

        <div className="space-y-6">
          {/* File upload area */}
          <div
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive ? 'border-accent bg-accent-soft' : 'border-border hover:border-border-light hover:bg-bg-elevated/50'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl bg-bg-elevated flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm font-medium text-text-primary mb-1">拖拽文件到这里，或点击选择</p>
              <p className="text-xs text-text-muted">支持 JPG、PNG、GIF、WebP、MP4、MOV · 单文件最大 200MB</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1 text-xs text-text-muted"><Image className="w-3 h-3" />照片</span>
                <span className="flex items-center gap-1 text-xs text-text-muted"><Film className="w-3 h-3" />视频</span>
              </div>
            </div>
          </div>

          {/* File previews */}
          {files.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {files.map((file, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden bg-bg-elevated aspect-square group">
                  {previews[i] ? (
                    <img src={previews[i]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-8 h-8 text-text-muted" />
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <FileText className="w-4 h-4 text-accent" />标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="为你的作品起个标题..."
              className="w-full px-4 py-3 bg-bg-input border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <FileText className="w-4 h-4 text-accent" />创作说明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="分享你的创作故事、拍摄心得..."
              rows={4}
              className="w-full px-4 py-3 bg-bg-input border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <Tag className="w-4 h-4 text-accent" />分类
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    category === c ? 'bg-accent text-white' : 'bg-bg-elevated text-text-secondary hover:bg-bg-hover border border-border'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <Tag className="w-4 h-4 text-accent" />标签
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="用空格分隔多个标签，如：风光 日落 海洋"
              className="w-full px-4 py-3 bg-bg-input border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <MapPin className="w-4 h-4 text-accent" />拍摄地点
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="如：云南·大理·洱海"
              className="w-full px-4 py-3 bg-bg-input border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Copyright + Original */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                <Shield className="w-4 h-4 text-accent" />版权声明
              </label>
              <select
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
                className="w-full px-4 py-3 bg-bg-input border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent transition-all appearance-none"
              >
                {copyrightOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                <Shield className="w-4 h-4 text-accent" />原创声明
              </label>
              <button
                onClick={() => setIsOriginal(!isOriginal)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                  isOriginal
                    ? 'bg-accent-soft text-accent border-accent/30'
                    : 'bg-bg-input text-text-muted border-border'
                }`}
              >
                {isOriginal ? '✓ 这是我的原创作品' : '点击声明原创'}
              </button>
            </div>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 p-3 bg-info-soft border border-info/20 rounded-xl">
            <Info className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
            <p className="text-xs text-info/80">作品提交后将经过 AI + 人工审核，通常在1小时内完成。请确保内容合规且不侵犯他人权益。</p>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleUpload}
            disabled={files.length === 0 || !title.trim() || uploading}
            className="w-full py-3.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                上传中...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                发布作品
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
