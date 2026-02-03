export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type MovieStatus = 'active' | 'archived';
export interface Movie {
  id: string;
  title: string;
  year: number;
  status: MovieStatus;
  votesNap: number;
  votesEngaging: number;
  tags: string[];
}
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export interface Submission {
  id: string;
  title: string;
  year: number;
  reason: string;
  status: SubmissionStatus;
  createdAt: number;
}
// Keep existing User/Chat types for template compatibility if needed,
// though we'll focus on the Nap Movies entities.
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}