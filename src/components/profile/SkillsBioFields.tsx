
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { ProfileSchema } from "./ProfileSchema";

interface SkillsBioFieldsProps {
  control: Control<ProfileSchema>;
}

export function SkillsBioFields({ control }: SkillsBioFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills</FormLabel>
            <FormControl>
              <Input placeholder="e.g. JavaScript, React, Python (comma-separated)" {...field} />
            </FormControl>
            <FormDescription>
              Enter your skills separated by commas
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell others about yourself, your interests, and your expertise..."
                {...field}
                rows={4}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
