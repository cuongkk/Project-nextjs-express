import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: String, // người nhận: có thể là ứng viên hoặc công ty (account-company)
    type: String, // application-status, new-job, system, ...
    title: String,
    message: String,
    data: Object,
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model("Notification", schema, "notifications");

export default Notification;
