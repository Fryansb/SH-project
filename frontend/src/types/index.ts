export interface User {
  id: number;
  username?: string;
  email: string;
  role?: 'admin' | 'member';
  github_url?: string;
  discord_id?: string;
  created_at?: string;
  date_joined?: string;
}

export interface Stack {
  id: number;
  name: string;
}

export interface ProjectMemberSummary {
  id: number;
  email: string;
  username?: string;
}

export interface Project {
  id: number;
  name: string;
  client_name: string;
  description: string;
  status: 'lead' | 'briefing' | 'contract' | 'development' | 'delivered' | 'support';
  status_label?: string;
  required_stacks?: string[];
  required_stack_ids?: number[];
  assigned_members?: ProjectMemberSummary[];
  assigned_member_ids?: number[];
  estimated_hours: number;
  budget: string;
  house_fee: string;
  github_repo?: string;
  deadline: string;
  created_at?: string;
  documents_count?: number;
  history_count?: number;
}

export interface ProjectDocumentMemberSummary {
  id: number;
  email: string;
  username?: string;
}

export interface ProjectDocument {
  id: number;
  project_id: number;
  project_name?: string;
  title: string;
  description: string;
  file: string;
  file_name?: string;
  file_url?: string | null;
  visibility: 'private' | 'assigned' | 'custom';
  allowed_members?: ProjectDocumentMemberSummary[];
  uploaded_by_email?: string;
  created_at?: string;
}

export interface ProjectHistoryEntry {
  id: number;
  project: number;
  project_name?: string;
  action: 'created' | 'updated' | 'assigned' | 'document' | 'note' | string;
  title: string;
  description: string;
  created_by_email?: string;
  created_at: string;
}

export interface Member {
  id: number;
  user: number;
  email?: string;
  github_url?: string;
  discord_id?: string;
  stack_ids?: number[];
  user_email?: string;
  user_github_url?: string;
  user_discord_id?: string;
  stacks?: string[];
  weekly_hours: number;
  available_hours: number;
  rating: number;
  priority_score: number;
  last_project_date?: string | null;
  created_date?: string;
}

export interface HourRegistry {
  id: number;
  member: number;
  member_email?: string;
  member_username?: string;
  project: number;
  project_name?: string;
  hours: number;
  date: string;
  description?: string;
  created_at?: string;
}

export interface HourRegistryPayload {
  member_id?: number;
  project_id: number;
  hours: number;
  date: string;
  description?: string;
}

export interface PriorityQueueProjectSummary {
  id: number;
  name: string;
  required_stacks?: string[];
}

export interface PriorityQueueItem {
  id: number;
  member_id: number;
  member_name: string;
  member_email: string;
  priority_score: number;
  stack_bonus: number;
  matching_stacks: string[];
  available_hours: number;
  weekly_hours: number;
  rating: number;
  last_project_date?: string | null;
  position: number;
  is_current_user: boolean;
}

export interface PriorityQueueResponse {
  generated_at?: string;
  project: PriorityQueueProjectSummary | null;
  count: number;
  current_member_position?: number | null;
  results: PriorityQueueItem[];
}

export interface PriorityReorderPayload {
  ordered_member_ids: number[];
  project_id?: number;
}

export interface PerformanceSummary {
  member_count: number;
  project_count: number;
  active_project_count: number;
  delivered_project_count: number;
  members_with_projects: number;
  total_hours: number;
  average_hours_per_member: number;
  average_priority_score: number;
  average_rating: number;
}

export interface PerformanceMemberReport {
  member_id: number;
  name: string;
  email: string;
  priority_score: number;
  available_hours: number;
  weekly_hours: number;
  rating: number;
  last_project_date?: string | null;
  total_hours: number;
  project_count: number;
  active_project_count: number;
  delivered_project_count: number;
  stacks: string[];
}

export interface PerformanceReport {
  generated_at?: string;
  summary: PerformanceSummary;
  members: PerformanceMemberReport[];
  top_priority_members: PerformanceMemberReport[];
}

export interface FinancialSummary {
  project_count: number;
  active_project_count: number;
  delivered_project_count: number;
  total_budget: string;
  total_house_fee: string;
  total_member_share: string;
  average_budget: string;
}

export interface FinancialProjectReport {
  project_id: number;
  name: string;
  client_name: string;
  status: Project['status'];
  status_label: string;
  budget: string;
  house_fee: string;
  remaining_budget: string;
  member_count: number;
  member_share: string;
  deadline: string;
}

export interface FinancialReport {
  generated_at?: string;
  summary: FinancialSummary;
  projects: FinancialProjectReport[];
}

export interface HoursSummary {
  entry_count: number;
  total_hours: number;
  member_count: number;
  project_count: number;
  average_hours_per_member: number;
  average_hours_per_project: number;
}

export interface HoursMemberReport {
  member_id: number;
  name: string;
  email: string;
  total_hours: number;
  entry_count: number;
  available_hours: number;
  weekly_hours: number;
  last_activity_date?: string | null;
}

export interface HoursProjectReport {
  project_id: number;
  name: string;
  client_name: string;
  total_hours: number;
  entry_count: number;
  member_count: number;
  latest_activity_date?: string | null;
}

export interface HoursTimelineEntry {
  date: string;
  total_hours: number;
  entry_count: number;
}

export interface HoursReport {
  generated_at?: string;
  summary: HoursSummary;
  members: HoursMemberReport[];
  projects: HoursProjectReport[];
  timeline: HoursTimelineEntry[];
}
