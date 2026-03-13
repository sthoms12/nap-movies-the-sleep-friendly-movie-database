export type MovieStatus = 'active' | 'archived';

export interface Movie {
  id: string;
  title: string;
  year: number;
  duration?: number;
  status: MovieStatus;
  napScore: number;
  tags: string[];
}
