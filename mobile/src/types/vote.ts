export type VoteType = 'up' | 'down';

export interface Vote {
  id: string;
  featureId: string;
  userId: string;
  type: VoteType;
  createdAt: string;
}

export interface VoteStats {
  featureId: string;
  upvotes: number;
  downvotes: number;
  total: number;
}

export interface VoteInput {
  type: VoteType;
}
