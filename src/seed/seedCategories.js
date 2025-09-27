import mongoose from "mongoose";
import Category from "./../models/Category.js";
import env from './../config/env.js';

const categories = [
  { name: "News", slug: "news" },
  { name: "Life", slug: "life" },
  { name: "Tech", slug: "tech" },
  { name: "Travel", slug: "travel" },
  { name: "Money", slug: "money" },
  { name: "Sports", slug: "sports" },
  { name: "Entertainment", slug: "entertainment" },
];

async function seedCategories() {
  try {
    await mongoose.connect(env.mongoUri); // use your env.js value
    await Category.deleteMany({});
    const inserted = await Category.insertMany(categories);
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

seedCategories();

