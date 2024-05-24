const experss = require('express');
const app = experss()
const cors = require('cors');

const PORT = process.env.PORT || 3000;

process.env.TZ="Asia/Tehran";
app.use(cors());
app.use(experss.json());



const userRouter = require('./routes/users.routes');
const todoRouter = require('./routes/todos.routes');

app.use('/api/v1/auth', userRouter)
app.use('/api/v1', todoRouter)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})