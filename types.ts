
export enum Tab {
  HOME = 'HOME',
  TASKS = 'TASKS',
  STORE = 'STORE',
  PROFILE = 'PROFILE'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Channel {
  id: string;
  name: string;
  icon: string; // Added icon
  type: 'COUPLE' | 'HOUSEHOLD';
  members: string[]; // User IDs
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  stars: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  stars: number;
  icon: string;
  channelType: 'ALL' | 'COUPLE' | 'HOUSEHOLD';
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
}

export interface FeedItem {
  id: string;
  taskId: string;
  channelId: string;
  userId: string;
  taskTitle: string;
  imageUrl?: string; // Made optional for rewards
  emoji?: string; // Added for rewards
  type?: 'TASK' | 'REWARD'; // Added type
  timestamp: number;
  status: VerificationStatus;
  likes: string[]; // Array of User IDs who liked
  comments: Comment[];
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  emoji: string;
  description: string;
  channelType: 'ALL' | 'COUPLE' | 'HOUSEHOLD';
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export type TimeRange = 'WEEK' | 'MONTH' | 'YEAR';
