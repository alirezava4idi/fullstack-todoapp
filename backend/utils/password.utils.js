
const { scrypt, randomBytes, scryptSync, timingSafeEqual } = require('node:crypto');
const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

/**
 * @param {String} password
 * @return {String}
 */
function passwordSanatize(password)
{
    
    password = password.trim();
    if (password.length < 8 || password.length > 20)
    {
        throw new Error("invalid password");
    }
    if (!pattern.test(password)) {
        throw new Error('invalid passsword'); 
    }
    return password
}


function hashPassword(password)
{
    const salt = randomBytes(16).toString("hex");
    const buff = scryptSync(password, salt, 64);
    const hashedPassword = `${buff.toString("hex")}.${salt}`
    return hashedPassword;
}

function comparePassword(
    storedPassword,
    suppliedPassword) {
    // split() returns array
    const [hashedPassword, salt] = storedPassword.split(".");
    // we need to pass buffer values to timingSafeEqual
    const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
    // we hash the new sign-in password
    const suppliedPasswordBuf = scryptSync(suppliedPassword, salt, 64);
    // compare the new supplied password with the stored hashed password
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  }


module.exports = {passwordSanatize, hashPassword, comparePassword}