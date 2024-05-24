import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../Services/todo.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-new-todo',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingComponent],
  templateUrl: './new-todo.component.html',
  styleUrl: './new-todo.component.scss'
})
export class NewTodoComponent implements OnInit{
  todoForm!: FormGroup;
  errMessage: string = '';
  isLoading: boolean = false;

  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  RefreshTodos: EventEmitter<boolean> = new EventEmitter();

  todoService: TodoService = inject(TodoService);




  ngOnInit(): void {
    this.todoForm = new FormGroup({
      todoName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9_]+$')])
    })
  }

  onCreateTodoClicked()
  {
    if(this.todoForm.invalid)
      {
        // //console.log(this.todoForm.get('todoName')?.errors)
        this.todoForm.get('todoName')?.markAsTouched();
        return
      }
    this.isLoading = true;
    this.todoService.createTodo(this.todoForm.value.todoName).subscribe({
      next: (res: string) =>
      {
        // //console.log(res);
        this.isLoading = false;
        this.errMessage = '';
        this.CloseForm.emit(false);
        this.RefreshTodos.emit(true);
      },
      error: (err: any) =>
      {
        this.isLoading = false;
        // //console.log(err)
        this.errMessage = err;
      }
    })
  }

  onCloseForm()
  {
    this.CloseForm.emit(false);
  }
  
}
