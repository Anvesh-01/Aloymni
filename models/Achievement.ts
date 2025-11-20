// models/Achievement.ts
import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  description: string;
  image: string; // Base64 or URL
  alumniName: string;
  alumniDesignation: string;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  alumniName: { type: String, required: true },
  alumniDesignation: { type: String, required: true },
}, { timestamps: true });

const Achievement = models.Achievement || model<IAchievement>('Achievement', AchievementSchema);

export default Achievement;