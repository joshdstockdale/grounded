import { httpResource, HttpResourceRequest } from '@angular/common/http';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './api/message.service';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  private messageService = inject(MessageService)

  message$: Observable<{ message: string } | null> = of(null)
  getData() {
    this.message$ = this.messageService.getMessage()
  }
}
