import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AnalyzeRequest {
  prompt: any;
  models: string[];
  apiKey: string;
}

export interface AnalyzeResponse {
  success: boolean;
  model: string;
  attemptNumber: number;
  totalAttempts: number;
  timestamp: string;
  analysis: {
    clarity: number;
    altitude: number;
    precision: number;
    feedback: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {
  private apiUrl = `${environment.apiUrl}/analyze`;

  constructor(private http: HttpClient) {}

  analyze(prompt: any, models: string[], apiKey: string): Observable<AnalyzeResponse> {
    const request: AnalyzeRequest = {
      prompt,
      models,
      apiKey
    };
    
    return this.http.post<AnalyzeResponse>(this.apiUrl, request);
  }
}
