import Category from "../models/Category.js";
import News from "../models/News.js";

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

// Get single category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

export const getCategoryBySlug = async (req, res, next) => {

  try {
    const category = await Category.findOne({ slug: { $regex: `^${req.params.slug}$`, $options: "i" } });
 
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // find news for this category
    const news = await News.find({ category_id: category._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, category, news });
  } catch (err) {
    next(err);
  }
};

// Create new category
export const createCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const category = await Category.create({ name, slug });
    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

// Update category
export const updateCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true }
    );
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

// Delete category
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
};
