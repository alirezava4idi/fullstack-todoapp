const mysql = require('mysql2');


try {

    function dbConnection()
    {
        return mysql.createConnection({
            host: 'db',
            port: 3306,
            user: 'alireza',
            password: '12345',
            database: 'tododb'
        });
    }
    console.log('db connection success');
} catch (error) {
    console.log(error)
}


module.exports = { dbConnection };