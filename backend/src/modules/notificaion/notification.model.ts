import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    receiverId: String,
    receiverType: {
      type: String,
      enum: ["user", "company"],
    },
    type: {
      type: String,
      enum: ["application_status", "new_message", "CV_ACCEPTED", "NEW_APPLICATION"],
      default: null,
    },
    title: String,
    message: String,
    data: Object,

    read: {
      type: Boolean,
      default: false,
    },

    readAt: Date,
    expiresAt: Date,
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", schema, "notifications");

export default Notification;
