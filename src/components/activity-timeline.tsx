"use client"

import { motion } from "framer-motion"
import { Activity, Clock } from "lucide-react"
import { format } from "date-fns"

interface ActivityItem {
  id: string
  type: 'update' | 'login' | 'security' | 'profile'
  description: string
  timestamp: Date
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <div className="flex items-center space-x-2 text-primary-600">
        <Activity className="w-5 h-5" />
        <h3 className="font-semibold">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            variants={item}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <div className="mt-1">
              <Clock className="w-4 h-4 text-primary-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {format(activity.timestamp, 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 