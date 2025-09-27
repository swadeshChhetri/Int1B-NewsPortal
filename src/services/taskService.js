import Task from '../models/Task.js';

export async function createTask(payload) {
  const t = new Task(payload);
  return t.save();
}

export async function getAllTasks(query = {}) {
  // support pagination/sorting later
  return Task.find().sort({ createdAt: -1 }).lean();
}

export async function getTaskById(id) {
  return Task.findById(id).lean();
}

export async function updateTask(id, payload) {
  return Task.findByIdAndUpdate(id, payload, { new: true });
}

export async function deleteTask(id) {
  return Task.findByIdAndDelete(id);
}
