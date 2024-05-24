import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  saveUser(user: any) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  deleteUser()
  {
    localStorage.removeItem("user");
  }

  getUser()
  {
    return localStorage.getItem("user");
  }
}
