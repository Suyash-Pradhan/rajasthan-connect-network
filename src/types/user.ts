export type UserRole = "admin" | "alumni" | "student";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  graduationYear?: number;
  specialization?: string;
  skills?: string[];
  company?: string;
  jobTitle?: string;
  bio?: string;
  location?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    linkedin?: string;
  };
  profileImage?: string;
  createdAt: string;
}

// Keep UserProfile as an alias to User for backward compatibility
export type UserProfile = User;

export interface MentorshipRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface ForumPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: "general" | "academic" | "career" | "technical";
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
