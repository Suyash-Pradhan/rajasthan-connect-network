
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/user";
import { ProfileSchema, profileSchema } from "@/components/profile/ProfileSchema";
import { BasicInfoFields } from "@/components/profile/BasicInfoFields";
import { ProfessionalInfoFields } from "@/components/profile/ProfessionalInfoFields";
import { SkillsBioFields } from "@/components/profile/SkillsBioFields";
import { ContactInfoFields } from "@/components/profile/ContactInfoFields";

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      graduationYear: user?.graduationYear?.toString() || "",
      specialization: user?.specialization || "",
      skills: user?.skills?.join(", ") || "",
      company: user?.company || "",
      jobTitle: user?.jobTitle || "",
      bio: user?.bio || "",
      location: user?.location || "",
      contactPhone: user?.contactInfo?.phone || "",
      contactEmail: user?.contactInfo?.email || user?.email || "",
      contactLinkedin: user?.contactInfo?.linkedin || "",
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    try {
      const updatedProfile: Partial<UserProfile> = {
        name: values.name,
        graduationYear: values.graduationYear,
        specialization: values.specialization || undefined,
        skills: values.skills,
        company: values.company || undefined,
        jobTitle: values.jobTitle || undefined,
        bio: values.bio || undefined,
        location: values.location || undefined,
        contactInfo: {
          phone: values.contactPhone || undefined,
          email: values.contactEmail || undefined,
          linkedin: values.contactLinkedin || undefined,
        },
      };
      
      await updateUserProfile(updatedProfile);
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your profile information to help others connect with you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <BasicInfoFields control={form.control} user={user} />
              <SkillsBioFields control={form.control} />
              <ContactInfoFields control={form.control} />

              <Button
                type="submit"
                className="w-full bg-rajasthan-orange hover:bg-rajasthan-orange/90"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
