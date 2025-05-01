
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { ForumHeader } from "@/components/forum/ForumHeader";
import { SearchAndFilter } from "@/components/forum/SearchAndFilter";
import { PostsList } from "@/components/forum/PostsList";
import { LoginPrompt } from "@/components/forum/LoginPrompt";
import { Button } from "@/components/ui/button";

export default function Forum() {
  const { posts, users, getUser } = useData();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filter posts based on search term and category
  const filteredPosts = posts.filter((post) => {
    const postAuthor = getUser(post.userId);
    
    // Filter by category
    if (categoryFilter !== "all" && post.category !== categoryFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(term);
      const matchesContent = post.content.toLowerCase().includes(term);
      const matchesAuthor = postAuthor?.name.toLowerCase().includes(term);
      const matchesTags = post.tags?.some(tag => tag.toLowerCase().includes(term));
      
      return matchesTitle || matchesContent || matchesAuthor || matchesTags;
    }
    
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <ForumHeader />
      
      <SearchAndFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <PostsList 
        filteredPosts={filteredPosts} 
        getUser={getUser}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
      />

      {!user && <LoginPrompt />}
      
      {searchTerm || categoryFilter !== "all" ? (
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : null}
    </div>
  );
}
