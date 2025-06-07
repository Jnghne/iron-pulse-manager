
export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  gymName: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  comments: Comment[];
  category?: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorRole: string;
  gymName: string;
  createdAt: Date;
  likes: number;
}

export interface MarketItem {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  seller: string;
  sellerRole: string;
  gymName: string;
  location: string;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  status: 'available' | 'sold' | 'reserved';
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
}

export type PostCategory = 'general' | 'tips' | 'questions' | 'announcements' | 'events';
export type MarketCategory = 'cardio' | 'weights' | 'accessories' | 'furniture' | 'supplements' | 'other';
