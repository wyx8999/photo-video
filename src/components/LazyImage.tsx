import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export default function LazyImage({ src, alt, className = '', onClick }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative" onClick={onClick}>
      {!loaded && (
        <div className="absolute inset-0 bg-bg-elevated animate-pulse rounded-lg" />
      )}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        />
      )}
    </div>
  );
}
