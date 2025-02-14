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
        <CardHeader className="space-y-1 border-b px-6 py-4">
          <CardTitle className="text-2xl font-bold text-center">Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8 p-6">
            {/* Profile Image Upload */}
            <motion.div 
              variants={itemAnimation}
              className="flex flex-col items-center space-y-4"
            >
              <Avatar className="w-32 h-32 md:w-40 md:h-40 ring-4 ring-primary-100 ring-offset-2">
                <AvatarImage src={profileImage} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary-50 to-primary-100">
                  <UserIcon className="w-16 h-16 md:w-20 md:h-20 text-primary-600" />
                </AvatarFallback>
              </Avatar>
              <Label 
                htmlFor="image" 
                className="cursor-pointer group relative inline-flex items-center justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2"
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
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={userData.fullName}
                  onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={userData.dob}
                  onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={userData.gender}
                  onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                  className="w-full rounded-md border border-input bg-white/50 backdrop-blur-sm px-3 py-2"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </motion.div>

            <motion.div variants={itemAnimation} className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                className="min-h-[150px] bg-white/50 backdrop-blur-sm"
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
                className="min-w-[120px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px] bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-600"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

