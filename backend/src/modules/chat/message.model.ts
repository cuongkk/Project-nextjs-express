import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    seenBy: { type: [String], default: [] },
  },
  { timestamps: true },
);

schema.index({ conversationId: 1, createdAt: 1 });

const Message = mongoose.model("Message", schema, "messages");

export default Message;

