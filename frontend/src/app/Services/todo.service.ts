import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Todo } from '../Models/Todo.model';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  

  httpClient: HttpClient = inject(HttpClient);

  baseURL: string = "http://localhost:3000/api/v1"

  getAllTodos()
  {
    return this.httpClient.get<any>(`${this.baseURL}/todos`).pipe(map(value => {
      // //console.log('in service', value.data)
      return value.data
    }))
  }

  createTodo(todo:string)
  {
    return this.httpClient.post<string>(`${this.baseURL}/todos`, {todo}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError),
      tap((res) => {
        // //console.log(res)
      })
    )

  }

  deleteTodo(id: string){
    return this.httpClient.delete(`${this.baseURL}/todos`, {
      headers: {
        'Content:Type': 'aaplication/json'
      },
      params: {
        'id': id
      }
    }).pipe(
      catchError(this.handleError),
      tap((res) => {
        // //console.log(res)
      })
    )
  }

  getAllTasks(todoId: string)
  {
    return this.httpClient.get(`${this.baseURL}/todo/tasks`, {
      params: {
        'todoId': todoId
      }
    }).pipe(
      catchError(this.handleError),
      tap((result) => {
        // //console.log(result);
        return result
      })
    )
  }

  createTask(todoId: string, value: string)
  {
    return this.httpClient.post(`${this.baseURL}/todo/tasks`, {
      todoId,
      value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError),
      tap((res) => {
        // //console.log(res)
        return res
      })
    )
  }

  deleteTask(task_id: string, todo_id: string)
  {
    return this.httpClient.delete(`${this.baseURL}/todo/tasks`, {
      params: {
        'todoId': todo_id,
        'taskId': task_id
      }
    }).pipe(
      catchError(this.handleError),
      tap((res) => {
        // //console.log(res)
      })
    )
  }

  statusChangeTask(status: any, task_id: string, todo_id: string)
  {
    const statusValue = status == 0 ? false : true;
    return this.httpClient.patch(`${this.baseURL}/todo/tasks`, {
      status: statusValue,
      task_id,
      todo_id
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError),
      tap((res) => {
        // //console.log(res);
      })
    )
  }

  private handleError(error: any)
  {
    // //console.log(error)
    return throwError(() => 'something went wrong')
  }
}
