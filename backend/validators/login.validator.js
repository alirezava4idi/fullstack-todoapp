function loginValidator(req, res, next)
{
    try {
        const username = req.body.username.trim();
        const password = req.body.password.trim();
        if (username === '' || password === '' || username.length > 10 || password.length > 20)
        {
            throw new Error()
        }
        else
        {
            req.body.user = {username, password}
            next()
        }
    } catch (error) {
        
        res.status(400).json({
            error: 'invalid username or password'
        })
    }
}

module.exports = loginValidator