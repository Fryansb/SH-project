export interface User {
  id: number;
  username?: string;
  email: string;
  role?: 'admin' | 'member';
}

export interface Member {
  id: number;
  user: number;
  user_email?: string;
  weekly_hours: number;
  available_hours: number;
  rating: number;
  priority_score: number;
  created_date?: string;
}
