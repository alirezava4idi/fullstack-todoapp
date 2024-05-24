import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { AuthResponse } from '../Models/auth-response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  authService: AuthService = inject(AuthService);

  isLoading: boolean = false;

  router: Router = inject(Router);

  error: String | null = null;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)])
    })
  }

  OnFormSubmit()
  {
    if (this.loginForm.invalid || this.isLoading)
    {
      this.loginForm.get('username')?.markAsTouched();
      this.loginForm.get('password')?.markAsTouched();
      return;
    }
    this.isLoading = true;

    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;

    this.authService.login(username, password).subscribe({
      next: (res: AuthResponse) => {
        // //console.log(res);
        this.isLoading = false;
        this.error = null;
        this.router.navigate(['/Home']); 
      },
      error: (errMsg: String) => {
        // //console.log(errMsg)
        this.error = errMsg;
        this.isLoading = false;
      }
    })
      
    
  }
}
