
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from "@/context/DataContext";
import { UserProfile, UserRole } from "@/types/user";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Search } from "lucide-react";

export default function ProfilesList() {
  const { users } = useData();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] = useState<string>("all");
  
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>(users);
  const [specializations, setSpecializations] = useState<string[]>([]);
  
  useEffect(() => {
    // Extract unique specializations for filter
    const uniqueSpecializations = Array.from(
      new Set(
        users
          .filter((u) => u.specialization)
          .map((u) => u.specialization as string)
      )
    );
    setSpecializations(uniqueSpecializations);
    
    // Apply filters
    let result = [...users];
    
    // Filter by role if not "all"
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }
    
    // Filter by specialization if not "all"
    if (specializationFilter !== "all") {
      result = result.filter((u) => u.specialization === specializationFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          (u.specialization && u.specialization.toLowerCase().includes(term)) ||
          (u.skills && u.skills.some((skill) => skill.toLowerCase().includes(term))) ||
          (u.company && u.company.toLowerCase().includes(term)) ||
          (u.jobTitle && u.jobTitle.toLowerCase().includes(term)) ||
          (u.location && u.location.toLowerCase().includes(term))
      );
    }

    // Exclude admin users from the results
    result = result.filter(u => u.role !== "admin");
    
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, specializationFilter]);

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
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Browse Profiles</h1>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search profiles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="alumni">Alumni</SelectItem>
              <SelectItem value="student">Students</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-600">No profiles found matching your criteria</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((profile) => (
            <Card key={profile.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.profileImage} alt={profile.name} />
                    <AvatarFallback className="text-xl">{getInitials(profile.name)}</AvatarFallback>
                  </Avatar>
                  <Badge variant={profile.role === "alumni" ? "default" : "outline"}>
                    {profile.role === "alumni" ? "Alumni" : "Student"}
                  </Badge>
                </div>
                <CardTitle className="mt-2">{profile.name}</CardTitle>
                <CardDescription className="flex flex-col">
                  {profile.specialization && (
                    <span>{profile.specialization}</span>
                  )}
                  {profile.company && profile.jobTitle && (
                    <span>
                      {profile.jobTitle} at {profile.company}
                    </span>
                  )}
                  {profile.location && (
                    <span className="text-gray-500">📍 {profile.location}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {profile.bio && (
                  <p className="text-gray-600 line-clamp-3">{profile.bio}</p>
                )}
                
                {profile.skills && profile.skills.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profile.skills.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{profile.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link to={`/profiles/${profile.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
