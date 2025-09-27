import News from "../models/News.js"; // adjust path if different

// GET /api/search?q=keyword
export const searchNews = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Query is required" });
    }

    const results = await News.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    })
      .populate("category_id", "name slug")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
