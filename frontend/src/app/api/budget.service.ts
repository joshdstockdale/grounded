import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development';

export type Budget = {
  id: string;
  name: string;
  month: number;
  year: number;
  archived: boolean;
  lines: LineDetail[];
};

export type LineDetail = {
  id: string;
  payee: string;
  auto: boolean;
  dayOfMonth: number;
  actual: number;
  balance?: number;
  budget: number;
};
export type UpdateLine = {
  col: keyof LineDetail;
  value: string | boolean | number;
  id: string;
};

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private http = inject(HttpClient);
  private baseUrl = `http://localhost:${environment.vitePort}/budget`;

  getBudget(): Observable<{ budget: Budget }> {
    return this.http.get<{ budget: Budget }>(this.baseUrl);
  }
  updateBudget(
    col: keyof Budget,
    value: string | boolean | number,
    id: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/${id}`, {
      col: col,
      value: value,
    });
  }
  addBudget(budget: Budget): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.baseUrl}`, { budget: budget });
  }
  deleteBudget(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
  updateBudgetLine(col: string, value: any, id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/line/${id}`, {
      col: col,
      value: value,
    });
  }
  addBudgetLine(line: LineDetail): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.baseUrl}/line`, { line: line });
  }
  deleteBudgetLine(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/line/${id}`);
  }
}
