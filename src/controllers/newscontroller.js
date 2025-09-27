import mongoose from "mongoose";
import News from "../models/News.js";
import { success, error as apiError } from "../utils/ApiResponse.js";
// import { uploadFileToS3 } from "./../utils/s3";
import path from "path";

// Fetch all news
export const getAllNews = async (req, res, next) => {
  try {
    const news = await News.find().populate("category_id", "name slug");
    // .populate("author_id", "name email");
    res.json({ success: true, news });
  } catch (err) {
    next(err);
  }
};

export const getHighlightNewsWithCategory = async (req, res, next) => {
  try {
    const highlights = await News.find({ is_highlight: true }).populate(
      "category_id",
      "name slug"
    );
    res.json(success(highlights));
  } catch (err) {
    next(err);
  }
};

export const postComment = async (req, res) => {
  const { newsId } = req.params;
  const { comment } = req.body;

  if (!comment)
    return res.status(400).json({ message: "Comment cannot be empty." });

  try {
    const newsItem = await News.findById(newsId);
    if (!newsItem) return res.status(404).json({ message: "News not found." });

    // Push new comment
    newsItem.comments.push({
      text: comment,
      createdAt: new Date(),
      userId: req.user._id,
    });

    await newsItem.save();

    // Populate user info (name, email) in comments
    const populatedNews = await News.findById(newsId).populate(
      "comments.userId",
      "name email"
    );

    res.status(201).json({
      message: "Comment added successfully.",
      comments: populatedNews.comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// export const getLatestComments = async (req, res, next) => {
//   try {
//     const newsWithComments = await News.find({}, { comments: 1 })
//       .populate("comments.userId", "name email")
//       .lean();

//     const allComments = newsWithComments
//       .flatMap(news => news.comments.map(c => ({ ...c, newsId: news._id })))
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       .slice(0, 10); // latest 10 comments

//     res.json(success(allComments));
//   } catch (err) {
//     next(err);
//   }
// };

// Create news

export const getLatestComments = async (req, res, next) => {
  try {
    // Get all news but only with comments
    const newsWithComments = await News.find({}, { comments: 1 })
      .populate("comments.userId", "name email")
      .lean();

    // Flatten all comments with newsId
    const allComments = newsWithComments
      .flatMap((news) =>
        (news.comments || []).map((c) => ({
          ...c, // c is already plain object due to .lean()
          newsId: news._id,
        }))
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
      .slice(0, 10); // only 10 comments

    res.json({ success: true, comments: allComments });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createNews = async (req, res, next) => {
  try {
    let { title, slug, content, status, is_highlight, category_id } = req.body;

    // Validate required fields
    if (!title || !slug || !content) {
      return res
        .status(400)
        .json(apiError("Title, slug, and content are required"));
    }

    // Convert is_highlight to boolean
    if (typeof is_highlight === "string") {
      is_highlight = is_highlight.toLowerCase() === "true";
    } else {
      is_highlight = Boolean(is_highlight);
    }

    // Either remove this validation or create a categories collection
    let validCategoryId = null;
    if (category_id && mongoose.Types.ObjectId.isValid(category_id)) {
      validCategoryId = category_id;
    }

    // Check if slug already exists
    const existingNews = await News.findOne({ slug });
    if (existingNews) {
      return res.status(400).json(apiError("Slug must be unique"));
    }

    // let imageUrl = null;
    // if (req.file) {
    //   imageUrl = await uploadFileToS3(req.file);
    // }

    let imageUrl = null;
    if (req.file) {
      // Save relative path (you can also store absolute if preferred)
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const news = new News({
      title,
      slug,
      content,
      status: status || "published",
      is_highlight: is_highlight || false,
      category_id: validCategoryId,
      image: imageUrl, // save S3 URL instead of local path
    });

    await news.save();
    res.status(201).json(success(news));
  } catch (err) {
    console.error("Error creating news:", err);

    // Handle duplicate key error (unique slug)
    if (err.code === 11000) {
      return res.status(400).json(apiError("Slug must be unique"));
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json(apiError("Validation failed: " + errors.join(", ")));
    }

    next(err);
  }
};

// Fetch highlights only
export async function getHighlights(req, res, next) {
  try {
    const highlights = await News.find({ is_highlight: true })
      .sort({ createdAt: -1 })
      .lean();
    res.json(success(highlights));
  } catch (err) {
    next(err);
  }
}

// Fetch news by ID
export async function getNewsById(req, res, next) {
  try {
    const news = await News.findById(req.params.id)
      .populate("comments.userId", "name email")
      .lean();

    if (!news) return res.status(404).json(apiError("News not found"));
    res.json(success(news));
  } catch (err) {
    next(err);
  }
}

// Update news
export const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { title, slug, content, status, is_highlight, category_id } = req.body;

    // Convert is_highlight to boolean
    if (typeof is_highlight === "string") {
      is_highlight = is_highlight.toLowerCase() === "true";
    } else {
      is_highlight = Boolean(is_highlight);
    }

    // Validate category_id
    let validCategoryId = null;
    if (category_id && mongoose.Types.ObjectId.isValid(category_id)) {
      validCategoryId = category_id;
    }

    // Check if slug is being updated → must be unique
    const existingNews = await News.findOne({ slug, _id: { $ne: id } });
    if (existingNews) {
      return res.status(400).json(apiError("Slug must be unique"));
    }

    // let imageUrl;
    // if (req.file) {
    //   imageUrl = await uploadFileToS3(req.file);
    // }
    let imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await News.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        content,
        status,
        is_highlight,
        category_id: validCategoryId,
        ...(imageUrl && { image: imageUrl }), // only update if new file is uploaded
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json(apiError("News not found"));
    }

    res.json(success(updated));
  } catch (err) {
    next(err);
  }
};

export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await News.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    }

    res.json({ success: true, message: "News deleted successfully" });
  } catch (err) {
    next(err);
  }
};
