const { dbConnection } = require('../database/connection');
function getAllTodos(req, res) {

    try {
        const user = req.user;
        const query = "SELECT * FROM todos WHERE creator_id = ?";
        dbConnection().query(query, [user.uuid], 
        function(err, result, _fields){
            if(err)
            {
                res.status(400).json({
                    error: "Something went wrong"
                })
            }else
            
            {
                result = result.map(item => {
                    return {...item, created_at: item.created_at.toLocaleString()}
                })
                console.log(result)
                res.status(200).json({
                    data: result
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: "Something went wrong"
        })
    }
    
}
function createTodo(req, res)
{
    try {
        let todoName = req.body.todo;
        todoName = todoName.trim();
        const pattern = /^[a-zA-Z0-9_]{3,10}$/;
        if(pattern.test(todoName))
        {
            const uuid = crypto.randomUUID();
            const creator_id = req.user.uuid;
            const created_at = new Date();
            dbConnection().query("INSERT INTO todos (uuid, name, creator_id, created_at) VALUES (?, ?, ?, ?)",
                                [uuid, todoName, creator_id, created_at],
                            function(error, results, _fields){
                                if (error)
                                {
                                    res.status(500).json({
                                        error: "Somthing went wrong",
                                        error
                                    })
                                }
                                else
                                {
                                    res.status(200).json({
                                        message: "Todo was Created successfully."
                                    })
                                }
                            })
        }else
        {
            res.status(400).json({
                error: "invalid name"
            })
        }
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: "Somthing went wrong"
        })
        
    }
}

function deleteTodo(req, res)
{
    try {
        const todoId = req.query.id;
        const query = "Delete From todos WHERE uuid = ? LIMIT 1";
        dbConnection().query(query, [todoId], function(err, result, _fields){
            if (err)
            {
                res.status(500).json({
                    error: "Internal Server Error"
                })
            }else
            {
                if (result.affectedRows == 1)
                {
                    res.status(200).json({
                        todoId,
                        message: 'todo was succussfully deleted'
                    })
                }
                else
                {
                    res.status(400).json({
                        error: "Something Went Wrong"
                    }) 
                }

            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: "Bad request",
            req
        }) 
        
    }
}

function getAllTasks(req, res)
{
    try {
        const todoId = req.query.todoId;
        const userId = req.user.uuid;
        if (!todoId)
        {
            throw Error()
        }
        const query = "SELECT * FROM tasks WHERE creator_id = ? AND todo_id = ?";
        dbConnection().query(query, [userId, todoId], function (err, result,  _fields){
            if (err)
            {
                res.status(500).json({
                    error: 'Internal Server Error'
                })
            }else
            {
                result = result.map(item => {
                    return {...item, created_at: item.created_at.toLocaleString()}
                })
                res.status(200).json({
                    data: result
                })
            }
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: 'Bad Request!'
        })
    }
}

function createTask(req, res)
{
    try {
        const todoId = req.body.todoId;
        const value = req.body.value.trim();
        const pattern = /^[a-zA-Z0-9_ ]{3,200}$/;
        if(!pattern.test(value)){
            throw Error('');
        }
        const userId = req.user.uuid;
        if (!todoId, !value)
        {
            throw Error()
        }
        const uuid = crypto.randomUUID(); 
        const created_at = new Date();
        const query = "INSERT INTO tasks (uuid, value, creator_id, todo_id, created_at) VALUES (?, ?, ?, ?, ?)";
        dbConnection().query(query, [uuid, value, userId, todoId, created_at], function (err, result, _fields){
            if (err)
            {
                res.status(500).json({
                    error: 'Internal Server Error'
                })

            }else
            {
                res.status(201).json({
                    message: 'Task Was Created Successfully'
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: 'Bad Request!!'
        })
    }
}

function deleteTask(req, res)
{
    try {
        const todoId = req.query.todoId;
        const taskId = req.query.taskId;
        const userId = req.user.uuid;
        if (!todoId && !taskId)
        {
            throw Error('')
        }
        else
        {
            const query = "DELETE FROM tasks WHERE todo_id = ? AND creator_id = ? AND uuid = ? LIMIT 1";
            dbConnection().query(query, [todoId, userId, taskId], function(err, result, _fields){
                if (err)
                {
                    res.status(500).json({
                        error: 'Internal Server Error'
                    })
                }else
                {
                    console.log(result.affectedRows == 1);
                    if (result.affectedRows == 1)
                    {
                        res.status(200).json({
                            message: 'Task was successfully deleted'
                        })
                    }
                    else
                    {
                        res.status(400).json({
                            error: 'Bad Request!',
                            
                        })

                    }
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: 'Bad Request!',
            
        })
    }
}

function changeTaskStatus(req, res)
{
    try {
        
        const todoId = req.body.todo_id;
        const taskId = req.body.task_id;
        let status = req.body.status;
        const userId = req.user.uuid;
        if (!todoId && !taskId && !status && typeof(status) != Boolean)
        {
            throw Error('')
        }
        else
        {
            status = !status;
            console.log(status);
            const query = "UPDATE tasks SET status = ? WHERE todo_id = ? AND creator_id = ? AND uuid = ? LIMIT 1";
            dbConnection().query(query, [status, todoId, userId, taskId], 
                function(err, result, _fields){
                    if(err)
                    {
                        res.status(500).json({
                            error: "Something went wrong!"
                        })
                    }
                    else
                    {
                        
                        if (result.affectedRows == 1)
                        {
                            res.status(200).json({
                                message: "Task was successfully updated!"
                            })
                        }
                        else
                        {
                            throw Error('');
                        }
                    }
                })
        }
    } catch (error) {
        res.status(400).json({
            error: 'Bad Request!'
        })    
    }

}

module.exports = { getAllTodos, createTodo, deleteTodo, getAllTasks, createTask, deleteTask, changeTaskStatus}