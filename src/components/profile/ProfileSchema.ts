
import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  graduationYear: z.string().optional()
    .transform((val) => val ? parseInt(val) : undefined),
  specialization: z.string().optional(),
  skills: z.string().optional()
    .transform((val) => val ? val.split(",").map(s => s.trim()) : []),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email({ message: "Please enter a valid email address" }).optional(),
  contactLinkedin: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
