export interface User {
  id: string;
  email: string;
  name: string;
  role: 'voyageur' | 'agent';
  phone?: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  station: string;
  line?: string;
  date: string;
  status: ComplaintStatus;
  attachments?: FileAttachment[];
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
  assignedAgent?: string;
  priority: 'low' | 'medium' | 'high';
}

export type ComplaintCategory = 
  | 'delay' 
  | 'payment' 
  | 'technical' 
  | 'security' 
  | 'cleanliness' 
  | 'staff' 
  | 'other';

export type ComplaintStatus = 
  | 'submitted' 
  | 'accepted' 
  | 'rejected' 
  | 'in_progress' 
  | 'treated';

export interface StatusHistoryEntry {
  id: string;
  status: ComplaintStatus;
  comment?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface DashboardStats {
  totalComplaints: number;
  complaintsByStatus: { [key in ComplaintStatus]: number };
  complaintsByCategory: { [key in ComplaintCategory]: number };
  complaintsByStation: { [station: string]: number };
  weeklyTrend: { date: string; count: number }[];
  prediction: { date: string; predicted: number }[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'voyageur' | 'agent') => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'voyageur' | 'agent';
}