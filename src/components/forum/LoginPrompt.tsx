
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const LoginPrompt = () => {
  return (
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
  );
};
