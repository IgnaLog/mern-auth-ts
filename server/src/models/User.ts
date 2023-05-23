import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  username: string;
  roles: {
    User: number;
    Editor: number;
    Admin: number;
  };
  password: string;
  refreshToken: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: [String],
});

export default mongoose.model<IUser>("User", userSchema);
