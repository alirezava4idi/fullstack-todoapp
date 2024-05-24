class User
{
    uuid;
    username;
    password;
    constructor(username, password) {
        this.uuid = Math.random() * 1000;
        this.username = username;
        this.password = password;
    }
}