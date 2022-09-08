import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      unique: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: false,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model('Comment', CommentSchema);
