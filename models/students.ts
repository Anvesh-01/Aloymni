import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  uid: string;
  clerkId?: string;
  clerkInvitationId?: string;
  invitationSent: boolean;
  invitationSentAt?: Date;
  role: 'admin' | 'user';
  alumniRef: mongoose.Schema.Types.ObjectId;
  verified?: boolean;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  uid: { type: String,  unique: true },
  clerkId: { type: String, unique: true, sparse: true },
  clerkInvitationId: { type: String, unique: true, sparse: true },
  invitationSent: { type: Boolean, default: false },
  invitationSentAt: { type: Date },
  role:{type:String, enum: ['admin', 'user'], default: 'user'},
  alumniRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni' },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

export default models.User || mongoose.model<IUser>('User', userSchema);

