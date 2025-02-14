"use client"

import { motion } from "framer-motion"
import { User as UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import type { User } from "@prisma/client"
import { theme } from "@/lib/theme"

interface ProfileViewProps {
  user: User & {
    profile: {
      id: string;
      dateOfBirth: Date;
      gender: string;
      bio: string;
      userId: string;
    } | null;
  };
}

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

export default function ProfileView({ user }: ProfileViewProps) {
  const router = useRouter();

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
        <motion.div variants={itemAnimation} className="p-8">
          {/* Profile Image Section */}
          <motion.div 
            className="flex flex-col items-center space-y-4 mb-8"
            whileHover={{ scale: 1.02 }}
          >
            <Avatar className="w-32 h-32 md:w-40 md:h-40 ring-4 ring-primary-100 ring-offset-2">
              <AvatarImage src={user.image || undefined} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-primary-50 to-primary-100">
                <UserIcon className="w-16 h-16 md:w-20 md:h-20 text-primary-600" />
              </AvatarFallback>
            </Avatar>
            <motion.h2 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700"
              variants={itemAnimation}
            >
              {user.fullName || 'Anonymous User'}
            </motion.h2>
          </motion.div>

          {/* Info Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={container}
          >
            {[
              { label: 'Email', value: user.email },
              { 
                label: 'Date of Birth', 
                value: user.profile?.dateOfBirth 
                  ? new Date(user.profile.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })
                  : 'Not set'
              },
              { 
                label: 'Gender', 
                value: user.profile?.gender?.replace('-', ' ') || 'Not set'
              },
              {
                label: 'Member Since',
                value: new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long'
                })
              }
            ].map((info, index) => (
              <motion.div
                key={info.label}
                variants={itemAnimation}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-sm font-medium text-primary-600 mb-2">
                  {info.label}
                </h3>
                <p className="text-lg font-medium text-primary-700 capitalize">
                  {info.value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bio Section */}
          <motion.div
            variants={itemAnimation}
            className="mt-8 bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl shadow-sm"
          >
            <h3 className="text-sm font-medium text-primary-600 mb-2">Bio</h3>
            <p className="text-lg text-primary-700 min-h-[100px] whitespace-pre-wrap">
              {user.profile?.bio || 'No bio available'}
            </p>
          </motion.div>

          {/* Edit Button */}
          <motion.div 
            className="flex justify-center mt-8"
            variants={itemAnimation}
          >
            <Button
              onClick={() => router.push('/profile/edit')}
              className="min-w-[200px] h-12 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Edit Profile
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
} 