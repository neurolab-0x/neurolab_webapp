export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'researcher' | 'doctor';
  avatar?: string;
  isEmailVerified: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  specialization?: string;
  licenseNumber?: string;
  hospital?: string;
  department?: string;
  patients?: string[];
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface UpdateProfileData {
  fullName?: string;
  username?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<User>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

export interface DoctorProfile extends User {
  specialization: string;
  licenseNumber: string;
  hospital: string;
  department: string;
  patients: string[];
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  appointments: Appointment[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency';
  notes?: string;
  createdAt: string;
  updatedAt: string;
} 