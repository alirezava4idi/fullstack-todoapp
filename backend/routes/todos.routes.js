const express = require('express');
const router = express.Router();


const todoControllers = require('../controllers/todos.controllers');
const protect = require('../middlewares/auth.middleware');


router.route('/todos').get(protect, todoControllers.getAllTodos);
router.route('/todos').post(protect, todoControllers.createTodo);
router.route('/todos').delete(protect, todoControllers.deleteTodo);

router.route('/todo/tasks').get(protect, todoControllers.getAllTasks);
router.route('/todo/tasks').post(protect,todoControllers.createTask);
router.route('/todo/tasks').delete(protect, todoControllers.deleteTask);
router.route('/todo/tasks').patch(protect, todoControllers.changeTaskStatus);
module.exports = router