import mongoose, { Schema } from 'mongoose';
import { IFeatureDocument, FeatureStatus } from '../interfaces/feature.interface';

const featureSchema = new Schema<IFeatureDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'rejected'] as FeatureStatus[],
      default: 'pending',
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    voteCount: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

featureSchema.index({ voteCount: -1 });

featureSchema.index({ status: 1, voteCount: -1 });
featureSchema.index({ author: 1, createdAt: -1 });

export const FeatureModel = mongoose.model<IFeatureDocument>('Feature', featureSchema);
