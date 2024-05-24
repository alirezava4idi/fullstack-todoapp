const { usernameSanatize } = require('../utils/username.utils');
const { passwordSanatize, hashPassword } = require('../utils/password.utils');


function signupValidator(req, res, next) {
    try {
        let username = req.body.username;
        username = usernameSanatize(username);
        let password = req.body.password;
        password = passwordSanatize(password);
        
        const hashedPassword = hashPassword(password);
        req.body.user = {username, hashedPassword}
        next();
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: 'invalid username or password'
        })        
    }
    
}


module.exports = signupValidator