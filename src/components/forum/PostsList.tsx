
import { ForumPost, User } from "@/types/user";
import { ForumPostCard } from "./ForumPostCard";

interface PostsListProps {
  filteredPosts: ForumPost[];
  getUser: (userId: string) => User | undefined;
  searchTerm: string;
  categoryFilter: string;
}

export const PostsList = ({ 
  filteredPosts, 
  getUser, 
  searchTerm, 
  categoryFilter 
}: PostsListProps) => {
  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-medium text-gray-600">No posts found</h3>
        <p className="text-gray-500 mt-2">
          {searchTerm || categoryFilter !== "all"
            ? "Try adjusting your search or filters"
            : "Be the first to start a discussion!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => {
        const postAuthor = getUser(post.userId);
        return (
          <ForumPostCard key={post.id} post={post} postAuthor={postAuthor} />
        );
      })}
    </div>
  );
};
