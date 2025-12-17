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

voteSchema.index({ user: 1, feature: 1 }, { unique: true });

voteSchema.index({ feature: 1 });

voteSchema.index({ user: 1 });

export const VoteModel = mongoose.model<IVoteDocument>('Vote', voteSchema);
