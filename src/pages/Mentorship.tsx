
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { MentorshipRequest } from "@/types/user";

export default function Mentorship() {
  const { user } = useAuth();
  const { getUserMentorshipRequests, getUser, updateMentorshipRequestStatus } = useData();
  const [activeTab, setActiveTab] = useState("sent");

  if (!user) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-gray-700">Authentication Required</h1>
        <p className="text-gray-500 mt-2">Please log in to view your mentorship connections.</p>
        <Button asChild className="mt-4">
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    );
  }

  const { sent, received } = getUserMentorshipRequests(user.id);
  
  const handleUpdateStatus = async (requestId: string, status: "accepted" | "rejected") => {
    await updateMentorshipRequestStatus(requestId, status);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const renderMentorshipCard = (request: MentorshipRequest, isReceived: boolean) => {
    const otherUserId = isReceived ? request.fromUserId : request.toUserId;
    const otherUser = getUser(otherUserId);
    
    if (!otherUser) return null;
    
    return (
      <Card key={request.id} className="mb-4">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={otherUser.profileImage} alt={otherUser.name} />
                <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
              </Avatar>
              <div>
                <Link to={`/profiles/${otherUser.id}`} className="hover:underline">
                  <CardTitle className="text-lg">{otherUser.name}</CardTitle>
                </Link>
                <CardDescription>
                  {otherUser.specialization}
                  {otherUser.jobTitle && otherUser.company && ` • ${otherUser.jobTitle} at ${otherUser.company}`}
                </CardDescription>
              </div>
            </div>
            <Badge variant={
              request.status === "pending" ? "outline" : 
              request.status === "accepted" ? "default" : "destructive"
            }>
              {request.status === "pending" ? "Pending" : 
               request.status === "accepted" ? "Accepted" : "Rejected"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="text-sm text-gray-600 mb-2">
            {isReceived ? "Requested on" : "Sent on"}: {formatDate(request.createdAt)}
          </div>
          <p className="text-gray-700 border-l-2 border-gray-200 pl-3 italic">
            "{request.message}"
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {isReceived && request.status === "pending" && (
            <div className="flex space-x-2">
              <Button 
                variant="default"
                onClick={() => handleUpdateStatus(request.id, "accepted")}
              >
                Accept
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleUpdateStatus(request.id, "rejected")}
              >
                Decline
              </Button>
            </div>
          )}
          <Button asChild variant="ghost" className={isReceived && request.status === "pending" ? "" : "ml-auto"}>
            <Link to={`/profiles/${otherUser.id}`}>View Profile</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Mentorship Connections</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sent">
            Sent Requests {sent.length > 0 && <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">{sent.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="received">
            Received Requests {received.length > 0 && <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">{received.length}</span>}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sent" className="mt-4">
          {sent.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-600">No sent requests</h3>
              <p className="text-gray-500 mt-2">You haven't sent any mentorship requests yet.</p>
              <Button asChild className="mt-4">
                <Link to="/profiles">Browse Profiles</Link>
              </Button>
            </div>
          ) : (
            <div>
              {sent.map(request => renderMentorshipCard(request, false))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="received" className="mt-4">
          {received.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-600">No received requests</h3>
              <p className="text-gray-500 mt-2">You haven't received any mentorship requests yet.</p>
            </div>
          ) : (
            <div>
              {received.map(request => renderMentorshipCard(request, true))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
