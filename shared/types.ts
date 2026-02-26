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
  napScore?: number;
}
export type VoteType = 'nap' | 'engaging';
export interface Vote {
  id: string;
  movieId: string;
  type: VoteType;
  createdAt: number;
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