import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../Validators/CustomValidators.validator';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { UsernameValidation } from '../Validators/CheckUsername.validator';
import { ErrToastComponent } from '../err-toast/err-toast.component';
import { AuthResponse } from '../Models/auth-response';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ErrToastComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  isLoading: boolean = false;
  usernameLoading: boolean = false;
  errMessage: string | null = null;



  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  usernameValidator: UsernameValidation = inject(UsernameValidation);

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern(/[a-zA-z]{3,10}/gm)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}/gm)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
    }, CustomValidators.checkSignupPasswordsMatch)
    
    this.signupForm.controls['username'].valueChanges.subscribe((data) => {
      this.usernameLoading = true;
      this.authService.isUsernameValid(data).subscribe({
        next: (res) => {
          this.signupForm.controls['username'].setErrors(null);
          this.usernameLoading = false;
          if (res)
          {
            // //console.log(res)
            this.signupForm.controls['username'].setErrors(res);
          }
        },
        error: (errMsg: string) => {
          // //console.log(errMsg)
          this.errMessage = errMsg;
          this.isLoading  = false;
          this.usernameLoading = false;
          setTimeout(() => {
            this.errMessage = null;
          }, 3000)
        }
      })
    })
  }

  OnFormSubmit()
  {
    
    // //console.log(this.signupForm)
    if (this.signupForm.status === 'INVALID' || this.isLoading)
    {
      this.isLoading = false;
      this.signupForm.get('username')?.markAsTouched();
      this.signupForm.get('password')?.markAsTouched();
      this.signupForm.get('passwordConfirm')?.markAsTouched();
      return;
    }
    this.isLoading = true;
    this.authService.signup(this.signupForm.value.username, this.signupForm.value.password)
    .subscribe({
      next: (response: AuthResponse) => {
        
        this.isLoading = false;
        this.router.navigate(['/Home']);
        // //console.log(response);
      },
      error: (errMsg: string) => {
        // //console.log(errMsg)
        this.errMessage = errMsg;
        this.isLoading  = false;

        setTimeout(() => {
          this.errMessage = null;
        }, 3000)
      }
    })
    
  }



  
}
