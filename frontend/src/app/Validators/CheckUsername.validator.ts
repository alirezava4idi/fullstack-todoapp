import { Injectable, inject } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { AuthService } from "../Services/auth.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class UsernameValidation implements AsyncValidator
{
    // authService: AuthService = inject(AuthService);
    constructor(private authService: AuthService){}

    validate = (control: AbstractControl<any, any>): 
    Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => 
    {
        return this.authService.isUsernameValid(control.value);
    }
}