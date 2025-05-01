
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { MentorshipRequest } from "@/types/user";

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const { getUser, getUserMentorshipRequests, createMentorshipRequest } = useData();
  const { user } = useAuth();
  
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const profile = getUser(id || "");
  
  if (!profile) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-gray-700">Profile not found</h1>
        <p className="text-gray-500 mt-2">The profile you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link to="/profiles">Back to Profiles</Link>
        </Button>
      </div>
    );
  }

  let mentorshipStatus: MentorshipRequest | undefined;
  
  if (user) {
    // Check if there's an existing mentorship request
    const { sent, received } = getUserMentorshipRequests(user.id);
    mentorshipStatus = sent.find(req => req.toUserId === profile.id) || 
                      received.find(req => req.fromUserId === profile.id);
  }

  const handleRequestMentorship = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await createMentorshipRequest({
        fromUserId: user.id,
        toUserId: profile.id,
        message,
      });
      setDialogOpen(false);
    } catch (error) {
      console.error("Error sending mentorship request:", error);
    } finally {
      setIsSubmitting(false);
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to="/profiles">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-4 w-4 mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to profiles
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.profileImage} alt={profile.name} />
                <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                <CardDescription className="text-lg">
                  {profile.specialization}
                  {profile.graduationYear && ` (${profile.graduationYear})`}
                </CardDescription>
                {profile.location && (
                  <p className="text-sm text-gray-500">📍 {profile.location}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <Badge variant={profile.role === "alumni" ? "default" : "outline"} className="mb-2">
                {profile.role === "alumni" ? "Alumni" : "Student"}
              </Badge>
              
              {user && user.id !== profile.id && profile.role === "alumni" && user.role === "student" && (
                <div>
                  {mentorshipStatus ? (
                    <Badge variant={mentorshipStatus.status === "pending" ? "outline" : 
                                  mentorshipStatus.status === "accepted" ? "default" : "destructive"}>
                      {mentorshipStatus.status === "pending" ? "Pending Request" : 
                       mentorshipStatus.status === "accepted" ? "Mentorship Active" : "Request Declined"}
                    </Badge>
                  ) : (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>Request Mentorship</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Request Mentorship</DialogTitle>
                          <DialogDescription>
                            Send a message to {profile.name} requesting mentorship.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Textarea
                            placeholder="Explain why you're interested in connecting and what you hope to learn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleRequestMentorship} disabled={!message || isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Request"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {profile.bio && (
            <div>
              <h3 className="font-medium text-lg mb-2">About</h3>
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {profile.company && profile.jobTitle && (
              <div>
                <h3 className="font-medium text-sm text-gray-500">Current Position</h3>
                <p className="text-gray-800">
                  {profile.jobTitle} at {profile.company}
                </p>
              </div>
            )}
            
            {profile.specialization && (
              <div>
                <h3 className="font-medium text-sm text-gray-500">Specialization</h3>
                <p className="text-gray-800">{profile.specialization}</p>
              </div>
            )}
            
            {profile.graduationYear && (
              <div>
                <h3 className="font-medium text-sm text-gray-500">Graduation Year</h3>
                <p className="text-gray-800">{profile.graduationYear}</p>
              </div>
            )}
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-lg mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />
          
          <div>
            <h3 className="font-medium text-lg mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {profile.contactInfo?.email && (
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Email</h3>
                  <p className="text-gray-800">{profile.contactInfo.email}</p>
                </div>
              )}
              
              {profile.contactInfo?.phone && (
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Phone</h3>
                  <p className="text-gray-800">{profile.contactInfo.phone}</p>
                </div>
              )}
              
              {profile.contactInfo?.linkedin && (
                <div>
                  <h3 className="font-medium text-sm text-gray-500">LinkedIn</h3>
                  <a 
                    href={profile.contactInfo.linkedin.startsWith('http') ? 
                      profile.contactInfo.linkedin : 
                      `https://${profile.contactInfo.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profile.contactInfo.linkedin}
                  </a>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
