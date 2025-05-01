
export type UserRole = "admin" | "alumni" | "student";

export interface UserProfile {
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
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
