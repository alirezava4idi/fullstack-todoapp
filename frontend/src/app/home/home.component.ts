import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { User } from '../Models/User.model';
import { exhaustMap, map, Subscription, take } from 'rxjs';
import { TodoService } from '../Services/todo.service';
import { NewTodoComponent } from '../new-todo/new-todo.component';
import { Todo } from '../Models/Todo.model';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NewTodoComponent, RouterLink, LoadingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);

  //@ts-ignore
  private userSubject: Subscription;

  isLoggedIn: boolean = false;

  todoService: TodoService = inject(TodoService);
  
  todos: Todo[] = [];

  newTodoModal: boolean = false;

  isDeleteMode: boolean = false;
  itemToDelete: string = '';

  isLoading: boolean = false;
  errMsg: string = '';

  ngOnInit(): void {
    this.authService.autoLogin();
    this.userSubject = this.authService.user.subscribe((user: User) => {
      this.isLoggedIn = user ? true : false;
    })
    this.isLoading = true;
    this.todoService.getAllTodos().subscribe({
      next: (value) => {
        this.isLoading = false;
        this.errMsg = '';
        //@ts-ignore
        this.todos = value.map(todo => {
          const isToday = (24 * 60 * 60 * 1000) - (new Date().getTime() - new Date(todo.created_at).getTime()) > 0;        
          return {...todo, created_at: isToday ? new Date(todo.created_at).toLocaleTimeString() : new Date(todo.created_at).toLocaleDateString()}
        });
        
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.errMsg = err.message;
      }
    })

  }

  ngOnDestroy(): void {
    this.userSubject.unsubscribe();
  }

  onRefreshClicked()
  {
    this.isLoading = true;
    this.todoService.getAllTodos().subscribe({
      next: (value) => {
        
        this.isLoading = false
        this.errMsg = '';
        //@ts-ignore
        this.todos = value.map(todo => {
          const isToday = (24 * 60 * 60 * 1000) - (new Date().getTime() - new Date(todo.created_at).getTime()) > 0;        
          return {...todo, created_at: isToday ? new Date(todo.created_at).toLocaleTimeString() : new Date(todo.created_at).toLocaleDateString()}
        });

      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.errMsg = err.message;
      }
    })
  }

  newModelClicked()
  {
    this.newTodoModal = true;
  }

  CloseCreateTodo()
  {
    this.newTodoModal = false;
  }
  onDeleteClicked(id: string)
  {
    this.isDeleteMode = true;
    this.itemToDelete = id;
  }

  deleteTodoAns(ans: boolean)
  {
    this.isLoading = true;
    if (ans == true)
      {
        // //console.log(this.itemToDelete);
        this.todoService.deleteTodo(this.itemToDelete).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.errMsg = '';
            this.onRefreshClicked()
            this.isDeleteMode = false;
            this.itemToDelete = '';
          },
          error: (err) => {
            this.isLoading = false;
            this.isDeleteMode = false;
            this.itemToDelete = '';
            this.errMsg = err;
            console.error(err, 'inja')
          }
        })
      }
    else
    {
      this.isDeleteMode = false;
      this.itemToDelete = '';
    }
  }
  onLogoutClicked()
  {
    // //console.log('logout')
    this.authService.logout()
  }
}
