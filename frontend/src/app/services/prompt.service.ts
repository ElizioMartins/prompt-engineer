import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PromptData {
  id?: number;
  titulo: string;
  taskContext: string;
  toneContext: string;
  backgroundData: string;
  detailedTask: string;
  examples: string;
  conversationHistory: string;
  immediateTask: string;
  thinkingStep: string;
  outputFormat: string;
  jsonOutput?: string;
  toonOutput?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private currentPromptSubject = new BehaviorSubject<PromptData>(this.getEmptyPrompt());
  public currentPrompt$: Observable<PromptData> = this.currentPromptSubject.asObservable();

  private getEmptyPrompt(): PromptData {
    return {
      titulo: '',
      taskContext: '',
      toneContext: '',
      backgroundData: '',
      detailedTask: '',
      examples: '',
      conversationHistory: '',
      immediateTask: '',
      thinkingStep: '',
      outputFormat: ''
    };
  }

  getCurrentPrompt(): PromptData {
    return this.currentPromptSubject.value;
  }

  updateField(field: keyof PromptData, value: string): void {
    const current = this.getCurrentPrompt();
    this.currentPromptSubject.next({
      ...current,
      [field]: value
    });
  }

  updatePrompt(prompt: Partial<PromptData>): void {
    const current = this.getCurrentPrompt();
    this.currentPromptSubject.next({
      ...current,
      ...prompt
    });
  }

  loadPrompt(prompt: PromptData): void {
    this.currentPromptSubject.next(prompt);
  }

  resetPrompt(): void {
    this.currentPromptSubject.next(this.getEmptyPrompt());
  }

  isFieldCompleted(field: keyof PromptData): boolean {
    const value = this.getCurrentPrompt()[field];
    return typeof value === 'string' && value.trim() !== '';
  }

  getCompletionPercentage(): number {
    const fields: (keyof PromptData)[] = [
      'taskContext', 'toneContext', 'backgroundData', 'detailedTask',
      'examples', 'conversationHistory', 'immediateTask', 'thinkingStep', 'outputFormat'
    ];
    
    const completed = fields.filter(f => this.isFieldCompleted(f)).length;
    return Math.round((completed / fields.length) * 100);
  }
}
