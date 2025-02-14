import { motion } from "framer-motion"

interface ProfileCompletionProps {
  user: any;  // Type this properly based on your user type
}

export function ProfileCompletion({ user }: ProfileCompletionProps) {
  // Calculate completion percentage based on filled fields
  const calculateCompletion = () => {
    const fields = [
      user.fullName,
      user.email,
      user.profile?.dateOfBirth,
      user.profile?.gender,
      user.profile?.bio,
      user.image
    ];
    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completion = calculateCompletion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-4 rounded-xl bg-white/80 backdrop-blur-sm shadow-md"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-primary-700">Profile Completion</h3>
        <span className="text-sm font-bold text-primary-600">{completion}%</span>
      </div>
      <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completion}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
        />
      </div>
      {completion < 100 && (
        <p className="mt-2 text-sm text-primary-600">
          Complete your profile to unlock all features
        </p>
      )}
    </motion.div>
  );
} 