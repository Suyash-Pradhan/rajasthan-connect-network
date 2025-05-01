
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { ForumComment } from "@/types/user";
import { format } from "date-fns";

export default function ForumPostDetail() {
  const { id } = useParams<{ id: string }>();
  const { getPostById, getPostComments, getUser, createComment } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const post = getPostById(id || "");
  const comments = post ? getPostComments(post.id) : [];
  const author = post ? getUser(post.userId) : undefined;
  
  if (!post) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-gray-700">Post not found</h1>
        <p className="text-gray-500 mt-2">The post you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link to="/forum">Back to Forum</Link>
        </Button>
      </div>
    );
  }

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to comment",
        variant: "destructive",
      });
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createComment({
        postId: post.id,
        userId: user.id,
        content: newComment,
      });
      
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted",
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-100 text-blue-800";
      case "career":
        return "bg-green-100 text-green-800";
      case "technical":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const renderComment = (comment: ForumComment) => {
    const commentAuthor = getUser(comment.userId);
    if (!commentAuthor) return null;
    
    return (
      <div key={comment.id} className="py-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={commentAuthor.profileImage} alt={commentAuthor.name} />
            <AvatarFallback>{getInitials(commentAuthor.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{commentAuthor.name}</h4>
              <Badge variant="outline">{commentAuthor.role}</Badge>
              <span className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className="mt-2 text-gray-800">{comment.content}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to="/forum">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-4 w-4 mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to forum
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <CardDescription className="flex flex-wrap items-center mt-2 gap-2">
                <Badge className={getCategoryBadgeColor(post.category)} variant="outline">
                  {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </Badge>
                <span>Posted on {formatDate(post.createdAt)}</span>
              </CardDescription>
            </div>
            {author && (
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src={author.profileImage} alt={author.name} />
                  <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{author.name}</p>
                  <p className="text-xs text-gray-500">{author.role}</p>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-800 whitespace-pre-line">{post.content}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-6">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
        
        <Card>
          {comments.length > 0 ? (
            <CardContent className="pt-6">
              {comments.map((comment, index) => (
                <div key={comment.id}>
                  {renderComment(comment)}
                  {index < comments.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          ) : (
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </CardContent>
          )}
          
          <CardFooter className="flex flex-col items-start pt-6">
            <div className="w-full">
              <h3 className="font-medium mb-2">Add a comment</h3>
              <Textarea
                placeholder={user ? "Write your comment here..." : "Please log in to comment"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!user}
                className="min-h-[100px]"
              />
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!user || !newComment.trim() || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Comment"}
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
