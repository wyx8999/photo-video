export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  src: string;
  thumbnail?: string;
  title: string;
  description: string;
  author: Creator;
  likes: number;
  views: number;
  comments: Comment[];
  tags: string[];
  category: string;
  createdAt: number;
  liked: boolean;
  saved: boolean;
  isOriginal: boolean;
  exif?: ExifData;
  location?: string;
  copyright?: string;
  width: number;
  height: number;
}

export interface ExifData {
  camera?: string;
  lens?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
  focalLength?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: number;
  likes: number;
  liked: boolean;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  totalLikes: number;
  level: number;
  isVerified: boolean;
  followed: boolean;
  joinedAt: string;
  location?: string;
  website?: string;
  tags: string[];
}

export type SortMode = 'latest' | 'hottest' | 'mostLiked';
export type ViewMode = 'grid' | 'waterfall';
