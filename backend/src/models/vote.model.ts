import mongoose, { Schema } from 'mongoose';
import { IVoteDocument, VoteType } from '../interfaces/vote.interface';

const voteSchema = new Schema<IVoteDocument>(
  {
    feature: {
      type: Schema.Types.ObjectId,
      ref: 'Feature',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['up', 'down'] as VoteType[],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index on user + feature - Task 33
// Ensures one vote per user per feature
voteSchema.index({ user: 1, feature: 1 }, { unique: true });

// Index for querying votes by feature
voteSchema.index({ feature: 1 });

// Index for querying votes by user
voteSchema.index({ user: 1 });

export const VoteModel = mongoose.model<IVoteDocument>('Vote', voteSchema);
