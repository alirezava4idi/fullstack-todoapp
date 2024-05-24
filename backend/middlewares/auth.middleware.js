
const jwt = require('jsonwebtoken');
const { dbConnection } = require('../database/connection');
const e = require('express');

function protect(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token)
        {
            res.status(401).json({
                error: "Invalid request"
            })
        }
        else
        {
            try {
                const isValid = jwt.verify(token, process.env.TOKEN_SECRET);
                if (!isValid)
                {
                    res.status(400).json({
                        error: "Invalid request"
                    })
                }
                else
                {
                    // check if user exists
                    
                    dbConnection().query("SELECT * FROM users WHERE uuid = ? LIMIT 1", [isValid.uuid], 
                    function(error, results, _fields){
                        if (error)
                        {
                            res.status(400).json({
                                error: "Invalid request"
                            })
                        }  
                        else
                        {
                            if (results.length > 0)
                            {
                                req.user = isValid;
                                next()
                            }
                            else
                            {
                                res.status(400).json({
                                    error: "Invalid request"
                                })
                            }
                        }
                    })
                }
            } catch (error) {
                res.status(400).json({
                    error: "Invalid request"
                })
            }
        }
    } catch (error) {
        res.status(400).json({
            error: "Something went wrong!"
        })
    }
}

module.exports = protect