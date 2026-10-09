export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  role: string;
}

export type ErrorTypes = {
  success: boolean;
  message: string;
};
