import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TodoService } from '../Services/todo.service';
import { Task } from '../Models/Task.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '../loading/loading.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LoadingComponent, NgClass],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {

  route: ActivatedRoute = inject(ActivatedRoute);
  todoService: TodoService = inject(TodoService);
  id: string = '';
  todoName: string = '';

  tasks: Task[] = [];
  taskForm!: FormGroup;

  isLoading: boolean = false;
  errMsg: string = '';

  ngOnInit(): void {
    this.taskForm = new FormGroup({
      taskValue: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_ ]{3,200}')])
    })
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.todoName = this.route.snapshot.paramMap.get('name')!
    // //console.log(this.id, this.todoName);
    this.getAllTasks()
  }

  getAllTasks()
  {
    this.isLoading = true;
    this.todoService.getAllTasks(this.id).subscribe({
      next: (res) => {
        this.isLoading = false;
        //@ts-ignore
        this.tasks = res.data;
        this.errMsg = '';
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.errMsg = err;
      }
    })
  }

  onFormSubmit()
  {
    this.isLoading = true;
    this.taskForm.get('taskValue')?.markAsTouched();
    if (this.taskForm.status === 'INVALID')
    {
      this.isLoading = false;
      return
    }
    // //console.log(this.taskForm.get('taskValue')?.value)
    this.todoService.createTask(this.id, this.taskForm.get('taskValue')?.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        // //console.log(res)
        this.taskForm.reset();
        this.getAllTasks();
        this.errMsg = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.errMsg = err;
      }
    })

  }

  onRefreshTasksClicked()
  {
    this.getAllTasks();
  }


  onDeleteTaskClicked(task_id: string)
  {
    this.isLoading = true;
    this.todoService.deleteTask(task_id, this.id).subscribe({
      next: (res) => {
        this.isLoading = false;
        // //console.log(res);
        this.getAllTasks()
        this.errMsg = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.errMsg = err;
      }
    })
  }

  onDoneTaskClicked(status: any, task_id: string)
  {
    // //console.log(status, task_id, this.id);
    this.isLoading = true;
    this.todoService.statusChangeTask(status, task_id, this.id).subscribe({
      next: (res) => {
        this.isLoading = false;
        // //console.log(res);
        this.getAllTasks();
        this.errMsg = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.errMsg = err;
      }
    })
  }
}
