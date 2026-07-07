export type MovieStatus = 'active' | 'archived';

export interface Movie {
  id: string;
  title: string;
  year: number;
  duration?: number;
  status: MovieStatus;
  napIndex: number;
  tags: string[];
  community?: {
    communityScore: number;
    comfortPicks: number;
    voteCount: number;
  };
}
