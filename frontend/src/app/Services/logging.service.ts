import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  logError(err: HttpErrorResponse)
  {
    // //console.log(err);
  }
}
