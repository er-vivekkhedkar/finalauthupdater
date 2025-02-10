"use client"

import { useState } from "react"
// import * as z from "zod"
import { User as UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { updateProfile } from "@/lib/actions"
// import { useRouter } from "next/navigation"



import { compressImage } from "@/lib/utils"
import type { User, Profile } from "@prisma/client"

// const profileSchema = z.object({
//   fullName: z.string().min(2, "Full name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   dob: z.string().refine((date) => new Date(date) < new Date(), "Date of birth must be in the past"),
//   gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
//   bio: z.string().max(500, "Bio must be 500 characters or less"),
//   image: z.string().optional(),
// })

// type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  initialUser: User & {
    profile?: Profile | null;
    image?: string | null;
    name?: string | null;
    email?: string | null;
  };
}

export default function ProfileUpdate({ initialUser }: ProfileFormProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const router = useRouter();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true
        });
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error("Error processing image. Please try a smaller file.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success("Profile updated successfully");
        // Optionally refresh the page or update the UI
        window.location.reload();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-1 border-b px-6 py-4">
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          <CardDescription>
            Update your profile information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <form onSubmit={handleSubmit}>
            {/* Profile Image Section */}
            <div className="mb-8 flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profileImage ?? initialUser?.image ?? ''} />
                <AvatarFallback>
                  <UserIcon className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center space-y-2">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="w-full max-w-xs"
                />
                <input type="hidden" name="image" value={profileImage ?? initialUser?.image ?? ''} />
                <p className="text-sm text-muted-foreground">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName"
                    name="fullName" 
                    defaultValue={initialUser?.name ?? ''} 
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email" 
                    defaultValue={initialUser?.email ?? ''} 
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob"
                    name="dob" 
                    type="date"
                    defaultValue={initialUser?.profile?.dateOfBirth?.toISOString().split('T')[0] ?? ''} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender" defaultValue={initialUser?.profile?.gender ?? ''}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio"
                  name="bio" 
                  defaultValue={initialUser?.profile?.bio ?? ''} 
                  placeholder="Tell us about yourself..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

