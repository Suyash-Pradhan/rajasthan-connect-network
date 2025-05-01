
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { ForumPost } from "@/types/user";
import { format } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Search } from "lucide-react";

const postFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters",
  }),
  category: z.enum(["general", "academic", "career", "technical"]),
  tags: z.string().optional().transform(val => val ? val.split(',').map(t => t.trim()) : undefined),
});

export default function Forum() {
  const { posts, users, getUser, createPost } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create a form with zod validation
  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "general",
      tags: "",
    },
  });

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

  // Handle form submission
  async function onSubmit(values: z.infer<typeof postFormSchema>) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a post",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createPost({
        userId: user.id,
        title: values.title,
        content: values.content,
        category: values.category,
        // Fix: Ensure tags is properly typed as string[]
        tags: values.tags || [],
      });
      
      form.reset();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

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
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Discussion Forum</h1>
          <p className="text-gray-600">
            Ask questions, share knowledge, and connect with others
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0" disabled={!user}>
              Create new post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create a new post</DialogTitle>
              <DialogDescription>
                Share your question or knowledge with the community
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a descriptive title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your post content here..." 
                          {...field} 
                          className="min-h-[150px]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="career">Career</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. react, engineering, interview" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Separate tags with commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search posts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="career">Career</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600">No posts found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || categoryFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Be the first to start a discussion!"}
            </p>
            {!searchTerm && categoryFilter === "all" && user && (
              <Button onClick={() => setDialogOpen(true)} className="mt-4">
                Create new post
              </Button>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => {
            const postAuthor = getUser(post.userId);
            return (
              <Link to={`/forum/${post.id}`} key={post.id} className="block">
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
          })
        )}
      </div>

      {!user && (
        <div className="mt-8 text-center bg-gray-50 py-6 rounded-lg">
          <h3 className="text-lg font-medium">Want to join the conversation?</h3>
          <p className="text-gray-600 mt-2">Sign in to create posts and comment</p>
          <div className="mt-4 flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
