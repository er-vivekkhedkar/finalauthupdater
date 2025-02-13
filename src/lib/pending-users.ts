interface PendingUser {
  email: string;
  password: string;
  fullName: string;
  verificationCode: string;
  expiresAt: Date;
}

// Make it a global variable to persist between requests
declare global {
  var pendingUsers: Map<string, PendingUser>;
}

if (!global.pendingUsers) {
  global.pendingUsers = new Map<string, PendingUser>();
}

export const pendingUsers = global.pendingUsers; 