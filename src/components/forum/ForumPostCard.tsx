
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { ForumPost, User } from "@/types/user";
import { format } from "date-fns";

interface ForumPostCardProps {
  post: ForumPost;
  postAuthor: User | undefined;
}

export const ForumPostCard = ({ post, postAuthor }: ForumPostCardProps) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const getPostExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
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

  return (
    <Link to={`/forum/${post.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <CardTitle>{post.title}</CardTitle>
              <CardDescription className="flex items-center mt-2">
                <Badge className={getCategoryBadgeColor(post.category)} variant="outline">
                  {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </Badge>
                <span className="mx-2">•</span>
                <span>{formatDate(post.createdAt)}</span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {postAuthor && (
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={postAuthor.profileImage} alt={postAuthor.name} />
                    <AvatarFallback>{getInitials(postAuthor.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{postAuthor.name}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{getPostExcerpt(post.content)}</p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
