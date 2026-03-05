export const firebaseErrorMessages: Record<string, string> = {
  // Email / password errors
  "auth/invalid-email": "Invalid email address",
  "auth/user-disabled": "User account disabled",
  "auth/user-not-found": "No account found with this email",
  "auth/wrong-password": "Incorrect password",
  "auth/email-already-in-use": "Email already registered",
  "auth/weak-password": "Weak password",
  "auth/too-many-requests": "Too many attempts, try later",
  "auth/operation-not-allowed": "Sign-in method not enabled",

  // OAuth / social login errors
  "auth/invalid-credential": "Invalid credentials",
  "auth/account-exists-with-different-credential": "Account exists with different sign-in method",
  "auth/credential-already-in-use": "Credential already linked to another account",
  "auth/provider-already-linked": "Provider already linked to this account",
  "auth/no-such-provider": "Requested provider not linked",
  "auth/user-cancelled": "Sign-in cancelled",

  // Custom token / session errors
  "auth/invalid-custom-token": "Invalid authentication token",
  "auth/custom-token-mismatch": "Custom token does not match project",

  // Email link sign-in errors
  "auth/expired-action-code": "Sign-in link expired",
  "auth/invalid-action-code": "Invalid or used sign-in link",

  // Fallback for unknown errors
  "default": "An unexpected error occurred"
};
