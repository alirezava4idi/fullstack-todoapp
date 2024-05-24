import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { authGuardGuard } from './Guards/auth-guard.guard';
import { TasksComponent } from './tasks/tasks.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [authGuardGuard]
    },
    {
        path: 'Home',
        component: HomeComponent,
        canActivate: [authGuardGuard]
    },
    {
        path: 'Todo/:name/:id',
        component: TasksComponent,
        canActivate: [authGuardGuard]
    }
    ,
    {
        path: 'Login',
        component: LoginComponent
    },
    {
        path: 'Signup',
        component: SignupComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }

];
