/**
 * 
 * @param {String} username 
 * @returns {String}
 */

function usernameSanatize(username)
{
    let pattern = /^[a-zA-z]{3,10}$/gm;
    let newUsername = username.trim();
    
    if(newUsername.length <= 0)
    {
        throw new TypeError("invalid username");
        
    }
    if (!pattern.test(newUsername))
    {
        throw new TypeError("invalid username");
    }

    newUsername = newUsername.toLowerCase();
    return newUsername;
}


module.exports = {usernameSanatize}