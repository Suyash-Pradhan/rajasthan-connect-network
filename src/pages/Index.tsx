
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";

export default function Index() {
  const { isAuthenticated, user } = useAuth();
  const { users, posts } = useData();
  
  const alumniCount = users.filter(u => u.role === "alumni").length;
  const studentCount = users.filter(u => u.role === "student").length;
  const forumPostCount = posts.length;

  return (
    <div className="flex flex-col space-y-10">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rajasthan-blue to-rajasthan-orange rounded-lg overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative px-8 py-16 sm:px-16 sm:py-20 lg:py-28 text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Connecting Students & Alumni
          </h1>
          <p className="mt-4 text-lg sm:text-xl max-w-lg">
            Join the Technical Education Department's platform to foster mentorship,
            share knowledge, and build your professional network.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {!isAuthenticated ? (
              <>
                <Button asChild size="lg" className="bg-white text-rajasthan-orange hover:bg-gray-100">
                  <Link to="/register">Sign Up</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                  <Link to="/login">Log In</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="bg-white text-rajasthan-orange hover:bg-gray-100">
                  <Link to="/profiles">Browse Profiles</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                  <Link to="/forum">Visit Forum</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <h3 className="text-5xl font-bold text-rajasthan-blue">{alumniCount}</h3>
            <p className="mt-2 text-gray-500">Alumni</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <h3 className="text-5xl font-bold text-rajasthan-orange">{studentCount}</h3>
            <p className="mt-2 text-gray-500">Students</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <h3 className="text-5xl font-bold text-rajasthan-maroon">{forumPostCount}</h3>
            <p className="mt-2 text-gray-500">Forum Discussions</p>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="bg-white rounded-lg shadow p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-rajasthan-blue/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-rajasthan-blue">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Mentorship</h3>
            <p className="text-gray-600">
              Connect with industry professionals and experienced alumni for guidance and mentorship.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-rajasthan-orange/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-rajasthan-orange">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Discussion Forum</h3>
            <p className="text-gray-600">
              Participate in discussions, ask questions, and share knowledge with peers and professionals.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-rajasthan-brown/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-rajasthan-brown">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Career Guidance</h3>
            <p className="text-gray-600">
              Get advice on career paths, job opportunities, and professional development.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!isAuthenticated && (
        <section className="bg-rajasthan-blue rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Join our community of students and alumni from the Technical Education Department, Government of Rajasthan.
          </p>
          <Button asChild size="lg" className="bg-white text-rajasthan-blue hover:bg-gray-100">
            <Link to="/register">Sign Up Now</Link>
          </Button>
        </section>
      )}
    </div>
  );
}
