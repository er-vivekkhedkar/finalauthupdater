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
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { useToast } from "@/hooks/use-toast";
import { useRef } from 'react';

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
  const { toast } = useToast();
  const profileRef = useRef<HTMLDivElement>(null);

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

  // Function to handle profile download
  const handleDownload = async () => {
    if (profileRef.current) {
      try {
        toast({
          title: "Preparing download...",
          description: "Creating your profile image",
        });

        const elements = profileRef.current.getElementsByClassName('text-transparent');
        const originalStyles: string[] = [];
        
        Array.from(elements).forEach((el: Element) => {
          originalStyles.push(el.className);
          el.className = el.className.replace('text-transparent', 'text-primary-700');
        });

        const canvas = await html2canvas(profileRef.current);
        
        // Restore original styles
        Array.from(elements).forEach((el: Element, i: number) => {
          el.className = originalStyles[i] || el.className;
        });

        canvas.toBlob((blob) => {
          if (blob) {
            const fileName = `${user.fullName?.replace(/\s+/g, '-') || 'profile'}-${format(new Date(), 'yyyy-MM-dd')}.png`;
            saveAs(blob, fileName);
            
            toast({
              title: "Success!",
              description: "Profile image downloaded successfully",
            });
          }
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to download profile image",
          variant: "destructive",
        });
      }
    }
  };

  // Function to handle profile sharing
  const handleShare = async () => {
    const shareData = {
      title: `${user.fullName}'s Profile`,
      text: `Check out ${user.fullName}'s profile on our platform!`,
      url: `${window.location.origin}/shared-profile/${user.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared!",
          description: "Profile shared successfully",
        });
      } else {
        // Fallback for browsers that don't support native sharing
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied!",
          description: "Profile link copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share profile",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="w-full max-w-4xl mx-auto space-y-4 px-4 sm:px-0"
    >
      <ProfileCompletion user={user} />

      <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
        {/* Quick Actions Bar */}
        <motion.div 
          variants={itemAnimation}
          className="border-b border-primary-100 p-3 sm:p-4 flex justify-end space-x-1 sm:space-x-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="p-3 sm:p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors relative group"
            title="Share Profile"
          >
            <Share2 className="w-5 h-5" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-primary-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Share Profile
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="p-3 sm:p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors relative group"
            title="Download Profile"
          >
            <Download className="w-5 h-5" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-primary-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Download Profile
            </span>
          </motion.button>
        </motion.div>

        <motion.div ref={profileRef} variants={itemAnimation} className="p-4 sm:p-8">
          {/* Profile Image Section - Enhanced for mobile */}
          <motion.div 
            className="flex flex-col items-center space-y-4 mb-6 sm:mb-8"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Avatar className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 ring-4 ring-primary-100 ring-offset-2">
                <AvatarImage src={user.image || undefined} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary-50 to-primary-100">
                  <UserIcon className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-primary-600" />
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <motion.h2 
              className="text-2xl sm:text-2xl font-bold text-primary-700"
              variants={itemAnimation}
            >
              {user.fullName || 'Anonymous User'}
            </motion.h2>
          </motion.div>

          {/* Info Grid - Improved mobile layout */}
          <motion.div 
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6"
            variants={container}
          >
            {[
              { label: 'Email', value: user.email },
              { 
                label: 'Date of Birth', 
                value: user.profile?.dateOfBirth 
                  ? format(new Date(user.profile.dateOfBirth), 'MMMM dd, yyyy')
                  : 'Not set'
              },
              { 
                label: 'Gender', 
                value: user.profile?.gender?.replace('-', ' ') || 'Not set'
              },
              {
                label: 'Member Since',
                value: format(new Date(user.createdAt), 'MMMM yyyy')
              }
            ].map((info, index) => (
              <motion.div
                key={info.label}
                variants={itemAnimation}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-primary-50/80 to-primary-100/80 p-4 rounded-xl shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-md"
              >
                <h3 className="text-sm font-medium text-primary-600 mb-1">
                  {info.label}
                </h3>
                <p className="text-base font-medium text-primary-700 capitalize break-words">
                  {info.value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bio Section - Mobile optimized */}
          <motion.div
            variants={itemAnimation}
            className="mt-6 sm:mt-8 bg-gradient-to-br from-primary-50/80 to-primary-100/80 p-4 rounded-xl shadow-sm"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-sm font-medium text-primary-600 mb-2">Bio</h3>
            <p className="text-base text-primary-700 min-h-[80px] sm:min-h-[100px] whitespace-pre-wrap">
              {user.profile?.bio || 'No bio available'}
            </p>
          </motion.div>

          {/* Edit Button - Made more prominent on mobile */}
          <motion.div 
            className="flex justify-center mt-6 sm:mt-8"
            variants={itemAnimation}
          >
            <Button
              onClick={() => router.push('/profile/edit')}
              className="w-full sm:w-auto sm:min-w-[200px] h-12 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Edit Profile
            </Button>
          </motion.div>
        </motion.div>

        {/* Additional Features Section - Mobile optimized */}
        <motion.div 
          variants={container}
          className="border-t border-primary-100 p-4 sm:p-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
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

        {/* Activity Timeline - Mobile optimized */}
        <motion.div 
          variants={itemAnimation}
          className="border-t border-primary-100 p-4 sm:p-6"
        >
          <ActivityTimeline activities={activities} />
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default ProfileView; 