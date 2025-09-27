import * as taskService from '../services/taskService.js';
import * as ApiResponse from '../utils/ApiResponse.js';

export async function createTask(req, res, next) {
  try {
    const payload = req.body;
    const task = await taskService.createTask(payload);
    res.status(201).json(ApiResponse.success(task));
  } catch (err) {
    next(err);
  }
}

export async function getTasks(req, res, next) {
  try {
    const tasks = await taskService.getAllTasks(req.query);
    res.json(ApiResponse.success(tasks));
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) return res.status(404).json(ApiResponse.error('Task not found'));
    res.json(ApiResponse.success(task));
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    if (!task) return res.status(404).json(ApiResponse.error('Task not found'));
    res.json(ApiResponse.success(task));
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id);
    res.json(ApiResponse.success(null, 'Deleted'));
  } catch (err) {
    next(err);
  }
}
