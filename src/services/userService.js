import User from '../models/User.js';

export async function createUser(payload) {
  const u = new User(payload);
  return u.save();
}

export async function getAllUsers() {
  return User.find().lean();
}
