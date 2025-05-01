
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ForumComment, ForumPost, MentorshipRequest, UserProfile } from "../types/user";
import { mockUsers, mockForumPosts, mockForumComments, mockMentorshipRequests } from "../data/mockData";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

interface DataContextType {
  users: UserProfile[];
  posts: ForumPost[];
  comments: ForumComment[];
  mentorshipRequests: MentorshipRequest[];
  getUser: (id: string) => UserProfile | undefined;
  getPostById: (id: string) => ForumPost | undefined;
  getPostComments: (postId: string) => ForumComment[];
  getUserMentorshipRequests: (userId: string) => {
    sent: MentorshipRequest[];
    received: MentorshipRequest[];
  };
  createPost: (post: Omit<ForumPost, "id" | "createdAt" | "updatedAt">) => Promise<boolean>;
  createComment: (comment: Omit<ForumComment, "id" | "createdAt" | "updatedAt">) => Promise<boolean>;
  createMentorshipRequest: (request: Omit<MentorshipRequest, "id" | "createdAt" | "status">) => Promise<boolean>;
  updateMentorshipRequestStatus: (requestId: string, status: "accepted" | "rejected") => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [posts, setPosts] = useState<ForumPost[]>(mockForumPosts);
  const [comments, setComments] = useState<ForumComment[]>(mockForumComments);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>(mockMentorshipRequests);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const getUser = (id: string) => {
    return users.find((user) => user.id === id);
  };

  const getPostById = (id: string) => {
    return posts.find((post) => post.id === id);
  };

  const getPostComments = (postId: string) => {
    return comments.filter((comment) => comment.postId === postId);
  };

  const getUserMentorshipRequests = (userId: string) => {
    const sent = mentorshipRequests.filter((req) => req.fromUserId === userId);
    const received = mentorshipRequests.filter((req) => req.toUserId === userId);
    return { sent, received };
  };

  const createPost = async (postData: Omit<ForumPost, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Action failed",
          description: "You must be logged in to create a post",
          variant: "destructive",
        });
        return false;
      }

      const now = new Date().toISOString();
      const newPost: ForumPost = {
        id: `post${posts.length + 1}`,
        ...postData,
        createdAt: now,
        updatedAt: now,
      };

      setPosts([newPost, ...posts]);
      
      toast({
        title: "Success",
        description: "Your post has been created",
      });
      
      return true;
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Action failed",
        description: "Failed to create post",
        variant: "destructive",
      });
      return false;
    }
  };

  const createComment = async (commentData: Omit<ForumComment, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Action failed",
          description: "You must be logged in to comment",
          variant: "destructive",
        });
        return false;
      }

      const now = new Date().toISOString();
      const newComment: ForumComment = {
        id: `comment${comments.length + 1}`,
        ...commentData,
        createdAt: now,
        updatedAt: now,
      };

      setComments([...comments, newComment]);
      
      toast({
        title: "Success",
        description: "Your comment has been posted",
      });
      
      return true;
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Action failed",
        description: "Failed to post comment",
        variant: "destructive",
      });
      return false;
    }
  };

  const createMentorshipRequest = async (requestData: Omit<MentorshipRequest, "id" | "createdAt" | "status">): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Action failed",
          description: "You must be logged in to request mentorship",
          variant: "destructive",
        });
        return false;
      }

      // Check if a request already exists
      const existingRequest = mentorshipRequests.find(
        (req) => req.fromUserId === requestData.fromUserId && req.toUserId === requestData.toUserId
      );

      if (existingRequest) {
        toast({
          title: "Request exists",
          description: "You have already sent a mentorship request to this user",
          variant: "destructive",
        });
        return false;
      }

      const newRequest: MentorshipRequest = {
        id: `req${mentorshipRequests.length + 1}`,
        ...requestData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      setMentorshipRequests([...mentorshipRequests, newRequest]);
      
      toast({
        title: "Request sent",
        description: "Your mentorship request has been sent",
      });
      
      return true;
    } catch (error) {
      console.error("Error creating mentorship request:", error);
      toast({
        title: "Action failed",
        description: "Failed to send mentorship request",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateMentorshipRequestStatus = async (requestId: string, status: "accepted" | "rejected"): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Action failed",
          description: "You must be logged in to update request status",
          variant: "destructive",
        });
        return false;
      }

      const updatedRequests = mentorshipRequests.map((req) => {
        if (req.id === requestId) {
          return { ...req, status };
        }
        return req;
      });

      setMentorshipRequests(updatedRequests);
      
      toast({
        title: "Status updated",
        description: `Mentorship request ${status}`,
      });
      
      return true;
    } catch (error) {
      console.error("Error updating mentorship request:", error);
      toast({
        title: "Action failed",
        description: "Failed to update request status",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        users,
        posts,
        comments,
        mentorshipRequests,
        getUser,
        getPostById,
        getPostComments,
        getUserMentorshipRequests,
        createPost,
        createComment,
        createMentorshipRequest,
        updateMentorshipRequestStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
