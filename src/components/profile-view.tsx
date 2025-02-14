"use client"

import { motion } from "framer-motion"
import { User as UserIcon, Share2, Download, Bell, Shield, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import type { User } from "@prisma/client"
import { theme } from "@/lib/theme"
import { ProfileCompletion } from "@/components/profile-completion"
import { ActivityTimeline } from "@/components/activity-timeline"
import { format } from "date-fns"

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

export function ProfileView({ user }: ProfileViewProps) {
  const router = useRouter();

  // Mock activities - in production, fetch this from your database
  const activities = [
    {
      id: '1',
      type: 'profile' as const,
      description: 'Updated profile information',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'update' as const,
      description: 'Changed profile picture',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ]

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      <ProfileCompletion user={user} />

      <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0 mx-4 sm:mx-0">
        {/* Add Quick Actions Bar */}
        <motion.div 
          variants={itemAnimation}
          className="border-b border-primary-100 p-4 flex justify-end space-x-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
            title="Share Profile"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
            title="Download Data"
          >
            <Download className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </motion.button>
        </motion.div>

        <motion.div variants={itemAnimation} className="p-4 sm:p-8">
          {/* Profile Image Section */}
          <motion.div 
            className="flex flex-col items-center space-y-4 mb-8"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 ring-4 ring-primary-100 ring-offset-2">
                <AvatarImage src={user.image || undefined} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary-50 to-primary-100">
                  <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-primary-600" />
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <motion.h2 
              className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700"
              variants={itemAnimation}
            >
              {user.fullName || 'Anonymous User'}
            </motion.h2>
          </motion.div>

          {/* Info Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
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
                className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 sm:p-6 rounded-xl shadow-sm overflow-hidden"
              >
                <h3 className="text-sm font-medium text-primary-600 mb-2">
                  {info.label}
                </h3>
                <p className="text-base sm:text-lg font-medium text-primary-700 capitalize break-words">
                  {info.value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bio Section */}
          <motion.div
            variants={itemAnimation}
            className="mt-8 bg-gradient-to-br from-primary-50 to-primary-100 p-4 sm:p-6 rounded-xl shadow-sm"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-sm font-medium text-primary-600 mb-2">Bio</h3>
            <p className="text-base sm:text-lg text-primary-700 min-h-[100px] whitespace-pre-wrap">
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
              className="min-w-[200px] h-12 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Edit Profile
            </Button>
          </motion.div>
        </motion.div>

        {/* Add Additional Features Section */}
        <motion.div 
          variants={container}
          className="border-t border-primary-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <motion.div
            variants={itemAnimation}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center space-x-4"
          >
            <Shield className="w-8 h-8 text-primary-600" />
            <div>
              <h3 className="font-semibold text-primary-700">Security Check</h3>
              <p className="text-sm text-primary-600">Review your account security</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemAnimation}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center space-x-4"
          >
            <Settings className="w-8 h-8 text-primary-600" />
            <div>
              <h3 className="font-semibold text-primary-700">Preferences</h3>
              <p className="text-sm text-primary-600">Customize your experience</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Add Activity Timeline */}
        <motion.div 
          variants={itemAnimation}
          className="border-t border-primary-100 p-6"
        >
          <ActivityTimeline activities={activities} />
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default ProfileView; 