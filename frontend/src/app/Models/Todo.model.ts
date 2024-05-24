export class Todo {
    constructor(public uuid: string, public name: string,
                public created_at: string, public isToday?: boolean
    ){}
}