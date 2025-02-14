"use client"

import { motion } from "framer-motion"
import { User as UserIcon, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { User } from "@prisma/client"
import { updateUserProfile } from "@/lib/actions"
import { ProfileCompletion } from "@/components/profile-completion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemAnimation = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

interface ProfileUpdaterProps {
  initialUser: User & {
    profile: {
      id: string;
      dateOfBirth: Date;
      gender: string;
      bio: string;
      userId: string;
    } | null;
  };
}

export default function ProfileUpdater({ initialUser }: ProfileUpdaterProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    fullName: initialUser.fullName || '',
    email: initialUser.email || '',
    dob: initialUser.profile?.dateOfBirth?.toISOString().split('T')[0] || '',
    gender: initialUser.profile?.gender || 'prefer-not-to-say',
    bio: initialUser.profile?.bio || '',
  });
  const [profileImage, setProfileImage] = useState(initialUser.image || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const result = await updateUserProfile({
        name: userData.fullName,
        email: userData.email,
        image: profileImage,
        profile: {
          upsert: {
            create: {
              dateOfBirth: new Date(userData.dob),
              gender: userData.gender,
              bio: userData.bio
            },
            update: {
              dateOfBirth: new Date(userData.dob),
              gender: userData.gender,
              bio: userData.bio
            }
          }
        }
      });

      if (result) {
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
        router.push('/');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update profile"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
        <CardHeader className="space-y-1 border-b px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-100">
          <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700">
            Update Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8 p-6">
            {/* Profile Image Upload */}
            <motion.div 
              variants={itemAnimation}
              className="flex flex-col items-center space-y-4"
            >
              <Avatar className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 ring-4 ring-primary-100 ring-offset-2">
                <AvatarImage src={profileImage} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary-50 to-primary-100">
                  <UserIcon className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-primary-600" />
                </AvatarFallback>
              </Avatar>
              <Label 
                htmlFor="image" 
                className="cursor-pointer group relative inline-flex items-center justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-lg shadow-md flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </motion.div>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProfileImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Label>
            </motion.div>

            {/* Form Fields */}
            <motion.div variants={itemAnimation} className="grid gap-6 md:grid-cols-2">
              {[
                { id: 'fullName', label: 'Full Name', type: 'text', value: userData.fullName },
                { id: 'email', label: 'Email', type: 'email', value: userData.email },
                { id: 'dob', label: 'Date of Birth', type: 'date', value: userData.dob },
                { 
                  id: 'gender', 
                  label: 'Gender', 
                  type: 'select', 
                  value: userData.gender,
                  options: [
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                  ]
                }
              ].map((field) => (
                <motion.div
                  key={field.id}
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <Label htmlFor={field.id} className="text-primary-700 font-medium">
                    {field.label}
                  </Label>
                  {field.type === 'select' ? (
                    <select
                      id={field.id}
                      value={field.value}
                      onChange={(e) => setUserData({ ...userData, [field.id]: e.target.value })}
                      className="w-full rounded-lg border border-primary-200 bg-white/50 backdrop-blur-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => setUserData({ ...userData, [field.id]: e.target.value })}
                      className="rounded-lg border-primary-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemAnimation} className="space-y-2">
              <Label htmlFor="bio" className="text-primary-700 font-medium">Bio</Label>
              <Textarea
                id="bio"
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                className="min-h-[150px] rounded-lg border-primary-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Tell us about yourself..."
              />
            </motion.div>

            <motion.div 
              variants={itemAnimation}
              className="flex justify-end space-x-4"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
                className="min-w-[120px] border-primary-200 text-primary-700 hover:bg-primary-50 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px] bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          </form>
        </CardContent>

        {/* Profile completion */}
        <motion.div 
          variants={itemAnimation}
          className="border-t border-primary-100 p-6 bg-gradient-to-r from-primary-50 to-primary-100"
        >
          <ProfileCompletion 
            user={{
              ...initialUser,
              fullName: userData.fullName,
              profile: {
                ...initialUser.profile,
                dateOfBirth: userData.dob ? new Date(userData.dob) : null,
                gender: userData.gender,
                bio: userData.bio
              }
            }} 
          />
        </motion.div>
      </Card>
    </motion.div>
  );
}

