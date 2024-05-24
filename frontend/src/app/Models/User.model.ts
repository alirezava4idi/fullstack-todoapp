export class User {
    constructor(
        public username: string,
        public id: string,
        private _token: string,
        private _expiresIn: string
    ){

    }

    get token()
    {
        
        if(!this._expiresIn)
        {
            return null
        }
        return this._token
    }
}