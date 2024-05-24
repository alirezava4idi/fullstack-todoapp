import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'todoapp';

  authSerivce: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.authSerivce.autoLogin();
  }

  
}
