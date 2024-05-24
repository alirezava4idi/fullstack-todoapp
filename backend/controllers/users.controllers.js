const { usernameSanatize } = require("../utils/username.utils");
const { comparePassword } = require("../utils/password.utils");
const jsonwebtoken = require('jsonwebtoken');
const { dbConnection } = require('../database/connection');




function login(req, res)
{
    if(req.method === 'POST')
    {
        
        const username = req.body.user.username;
        const password = req.body.user.password;
        dbConnection().query("SELECT * FROM users WHERE username = ? LIMIT 1", [username], 
        function(err, result, _fields){
           
            if(err)
            {
                res.status(500).json({
                    error: "Internal Server Error"
                })
            }
            else
            {
                if(result.length === 0)
                {
                    res.status(400).json({
                        error: "invalid username or password"
                    })
                }
                else
                {
                    const user = result[0];
                    if(comparePassword(user.password, password) === false)
                    {
                        res.status(400).json({
                            error: "invalid username or password"
                        })
                    }
                    else
                    {
                        const payload = {username: user.username, uuid: user.uuid}
                        const expireTime = 24 * 60 * 60 * 1000; // 1 day
                        const token = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
                            expiresIn: expireTime
                        })
                        
                        res.status(200).json({    
                            username: user.username, token, uuid: user.uuid, expireTime
                        })
                    }
                }
            }
        })

    }
    else
    {
        res.status(200).json({
            "Data": "hello from login"
        })
    }
}

function signup(req ,res)
{
    if (req.method === 'POST')
    {
        const username = req.body.user.username;
        const hashedPassword = req.body.user.hashedPassword;
        const uuid = crypto.randomUUID();

        const payload = {username, uuid}

        dbConnection().query(
            `INSERT INTO users (uuid, username, password) 
                VALUES (?, ?, ?);`, [uuid, username, hashedPassword],
                function (err, result, fields)
                {
                    if (err)
                    {
                        res.status(500).json({
                            error: 'Internal server error'
                        })
                    }
                    else
                    {
                        console.log(result);
                        const expireTime = 24 * 60 * 60 * 1000; // 1 day
                        const token = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
                            expiresIn: expireTime
                        })
                        
                        res.status(201).json({    
                            username, token, uuid, expireTime
                        })
                    }
                })


    }
    else
    {
        res.status(200).json({
            "Data": "hello from signup"
        })
    }
}

function isUsernameValid(req, res)
{

    try {
        let username = usernameSanatize(req.body.username);
        const query = "SELECT * FROM users WHERE username = ?";
        dbConnection().query(query, [username], function (err, result, _fields) {
            if (err)
            {
                res.status(500).json({
                    error: 'Internal server Error'
                })
            }
            else
            {
                if (result.length === 0)
                {
                    res.status(200).json(null)
                }
                else
                {
                    res.status(200).json({checkUsername:true})
                }
            }
        })
    } catch (error) {
        res.json({checkUsername: true})
    }
    
}

module.exports = {login, signup, isUsernameValid}
