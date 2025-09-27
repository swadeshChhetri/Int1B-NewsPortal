import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    is_highlight: { type: Boolean, default: false },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    image: { type: String },
    comments: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
      }
    ]
    // author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("News", newsSchema);