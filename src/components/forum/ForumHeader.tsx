
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreatePostForm } from "./CreatePostForm";
import { useState } from "react";

export const ForumHeader = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
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
        <CreatePostForm setDialogOpen={setDialogOpen} />
      </Dialog>
    </div>
  );
};
