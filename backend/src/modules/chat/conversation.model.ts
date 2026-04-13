import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    participants: {
      type: [String],
      required: true,
      default: [],
    },
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: null },
  },
  { timestamps: true },
);

schema.index({ jobId: 1, participants: 1 });
schema.index({ participants: 1, lastMessageAt: -1 });

const Conversation = mongoose.model("Conversation", schema, "conversations");

export default Conversation;

