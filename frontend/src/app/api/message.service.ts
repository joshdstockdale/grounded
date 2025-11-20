import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HttpClient);
  private baseUrl = `http://localhost:${environment.vitePort}`

  getMessage(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(this.baseUrl);
  }
}
