
import { ForumComment, ForumPost, MentorshipRequest, UserProfile } from "../types/user";

// Mock Users Data
export const mockUsers: UserProfile[] = [
  {
    id: "user1",
    email: "admin@rajasthan.edu",
    name: "Admin User",
    role: "admin",
    createdAt: new Date(2022, 0, 1).toISOString(),
  },
  {
    id: "user2",
    email: "rahul.sharma@gmail.com",
    name: "Rahul Sharma",
    role: "alumni",
    graduationYear: 2018,
    specialization: "Computer Science",
    skills: ["JavaScript", "React", "Node.js", "Database Design"],
    company: "TCS",
    jobTitle: "Senior Developer",
    bio: "Passionate about web development and mentoring young talents.",
    location: "Jaipur, Rajasthan",
    contactInfo: {
      phone: "+91 98765 43210",
      email: "rahul.sharma@gmail.com",
      linkedin: "linkedin.com/in/rahulsharma",
    },
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    createdAt: new Date(2022, 1, 15).toISOString(),
  },
  {
    id: "user3",
    email: "priya.patel@gmail.com",
    name: "Priya Patel",
    role: "alumni",
    graduationYear: 2019,
    specialization: "Electrical Engineering",
    skills: ["Circuit Design", "Power Systems", "Renewable Energy", "Project Management"],
    company: "Adani Power",
    jobTitle: "Project Engineer",
    bio: "Working on sustainable energy solutions. Happy to guide students interested in the power sector.",
    location: "Udaipur, Rajasthan",
    contactInfo: {
      phone: "+91 98765 43211",
      email: "priya.patel@gmail.com",
      linkedin: "linkedin.com/in/priyapatel",
    },
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    createdAt: new Date(2022, 2, 10).toISOString(),
  },
  {
    id: "user4",
    email: "vikram.singh@gmail.com",
    name: "Vikram Singh",
    role: "student",
    graduationYear: 2024,
    specialization: "Mechanical Engineering",
    skills: ["CAD", "3D Modeling", "Manufacturing Processes"],
    bio: "Final year mechanical engineering student looking for guidance in the manufacturing sector.",
    location: "Jodhpur, Rajasthan",
    contactInfo: {
      phone: "+91 98765 43212",
      email: "vikram.singh@gmail.com",
      linkedin: "linkedin.com/in/vikramsingh",
    },
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
    createdAt: new Date(2022, 3, 5).toISOString(),
  },
  {
    id: "user5",
    email: "anita.gupta@gmail.com",
    name: "Anita Gupta",
    role: "student",
    graduationYear: 2025,
    specialization: "Information Technology",
    skills: ["Python", "Machine Learning", "Data Analysis"],
    bio: "Passionate about data science and AI. Looking for mentorship in these areas.",
    location: "Kota, Rajasthan",
    contactInfo: {
      phone: "+91 98765 43213",
      email: "anita.gupta@gmail.com",
      linkedin: "linkedin.com/in/anitagupta",
    },
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
    createdAt: new Date(2022, 4, 20).toISOString(),
  },
];

// Mock Mentorship Requests
export const mockMentorshipRequests: MentorshipRequest[] = [
  {
    id: "req1",
    fromUserId: "user4",
    toUserId: "user2",
    message: "Hello Rahul, I'm interested in web development and would love to get your guidance on how to start a career in this field.",
    status: "pending",
    createdAt: new Date(2023, 5, 15).toISOString(),
  },
  {
    id: "req2",
    fromUserId: "user5",
    toUserId: "user3",
    message: "Hi Priya, I'm working on a renewable energy project and would appreciate your insights.",
    status: "accepted",
    createdAt: new Date(2023, 5, 10).toISOString(),
  },
  {
    id: "req3",
    fromUserId: "user5",
    toUserId: "user2",
    message: "I'm interested in learning more about your experience in the software industry.",
    status: "rejected",
    createdAt: new Date(2023, 4, 25).toISOString(),
  },
];

// Mock Forum Posts
export const mockForumPosts: ForumPost[] = [
  {
    id: "post1",
    userId: "user4",
    title: "Career paths in Mechanical Engineering",
    content: "I'm a final year mechanical engineering student. What are the most promising career paths in this field right now? Should I go for higher studies or look for a job?",
    category: "career",
    tags: ["mechanical", "career", "jobs"],
    createdAt: new Date(2023, 6, 10).toISOString(),
    updatedAt: new Date(2023, 6, 10).toISOString(),
  },
  {
    id: "post2",
    userId: "user5",
    title: "Resources for learning Machine Learning",
    content: "Can anyone recommend good resources, courses, or books to start learning machine learning from basics to advanced level?",
    category: "academic",
    tags: ["machine learning", "resources", "AI"],
    createdAt: new Date(2023, 6, 12).toISOString(),
    updatedAt: new Date(2023, 6, 15).toISOString(),
  },
  {
    id: "post3",
    userId: "user3",
    title: "Renewable Energy projects in Rajasthan",
    content: "Looking to connect with students interested in renewable energy. Rajasthan has great potential for solar energy projects. Let's discuss opportunities.",
    category: "technical",
    tags: ["renewable", "solar", "projects"],
    createdAt: new Date(2023, 6, 15).toISOString(),
    updatedAt: new Date(2023, 6, 15).toISOString(),
  },
];

// Mock Forum Comments
export const mockForumComments: ForumComment[] = [
  {
    id: "comment1",
    postId: "post1",
    userId: "user2",
    content: "Based on current trends, specializing in automation or sustainable manufacturing could be promising. I'd recommend getting some industry experience before pursuing higher studies.",
    createdAt: new Date(2023, 6, 11).toISOString(),
    updatedAt: new Date(2023, 6, 11).toISOString(),
  },
  {
    id: "comment2",
    postId: "post2",
    userId: "user2",
    content: "I'd recommend starting with Andrew Ng's course on Coursera. For books, 'Hands-On Machine Learning with Scikit-Learn and TensorFlow' is excellent for beginners.",
    createdAt: new Date(2023, 6, 13).toISOString(),
    updatedAt: new Date(2023, 6, 13).toISOString(),
  },
  {
    id: "comment3",
    postId: "post3",
    userId: "user4",
    content: "I'm currently working on a small-scale solar project for my final year. Would love to discuss and maybe collaborate!",
    createdAt: new Date(2023, 6, 16).toISOString(),
    updatedAt: new Date(2023, 6, 16).toISOString(),
  },
];
