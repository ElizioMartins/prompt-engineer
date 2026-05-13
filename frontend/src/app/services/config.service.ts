import { Injectable } from '@angular/core';

export interface OpenRouterConfig {
  apiKey: string;
  model1: string;
  model2: string;
  model3: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly STORAGE_KEY = 'openrouter_config';
  
  private defaultConfig: OpenRouterConfig = {
    apiKey: '',
    model1: 'google/gemma-4-26b-a4b-it:free',
    model2: 'minimax/minimax-m2.5:free',
    model3: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free'
  };

  getConfig(): OpenRouterConfig {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return { ...this.defaultConfig, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Erro ao carregar config:', error);
    }
    return { ...this.defaultConfig };
  }

  saveConfig(config: Partial<OpenRouterConfig>): void {
    try {
      const current = this.getConfig();
      const updated = { ...current, ...config };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao salvar config:', error);
      throw error;
    }
  }

  getModels(): string[] {
    const config = this.getConfig();
    return [config.model1, config.model2, config.model3].filter(m => m && m.trim() !== '');
  }

  getApiKey(): string {
    return this.getConfig().apiKey || '';
  }

  hasApiKey(): boolean {
    const key = this.getApiKey();
    return key !== '' && key.startsWith('sk-or-');
  }

  resetToDefaults(): void {
    this.saveConfig(this.defaultConfig);
  }
}
