import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { AuthService } from "../Services/auth.service";
import { Injector, inject } from "@angular/core";
import { Observable } from "rxjs";

export class CustomValidators
{

    static checkSignupPasswordsMatch(control: AbstractControl): ValidationErrors | null
    {
        if(control.get('password')?.value != control.get('passwordConfirm')?.value)
            {
                return {matchPassword: true}
            }
            return null
    }

}



