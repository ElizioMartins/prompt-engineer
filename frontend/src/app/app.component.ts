import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { PillarNavigatorComponent } from './components/pillar-navigator/pillar-navigator.component';
import { PillarInputComponent } from './components/pillar-input/pillar-input.component';
import { PlaygroundComponent } from './components/playground/playground.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ConfigPanelComponent,
    PillarNavigatorComponent,
    PillarInputComponent,
    PlaygroundComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="container">
          <h1>🚀 Prompt Engineer</h1>
          <p>Engenharia de Prompts de Alta Precisão</p>
        </div>
      </header>

      <main class="app-main">
        <div class="container">
          <!-- Config Panel -->
          <div class="config-section">
            <app-config-panel></app-config-panel>
          </div>

          <!-- 3-Column Layout -->
          <div class="three-column-layout">
            <!-- Column 1: Navigator -->
            <div class="column column-navigator">
              <app-pillar-navigator 
                (pillarSelected)="onPillarSelected($event)"
              ></app-pillar-navigator>
            </div>

            <!-- Column 2: Input -->
            <div class="column column-input">
              <app-pillar-input 
                [activePillarId]="activePillarId"
              ></app-pillar-input>
            </div>

            <!-- Column 3: Playground -->
            <div class="column column-playground">
              <app-playground></app-playground>
            </div>
          </div>
        </div>
      </main>

      <footer class="app-footer">
        <div class="container">
          <p>Prompt Engineer v1.0.0 | MIT License | 
            <a href="https://github.com/ElizioMartins/prompt-engineer" target="_blank">GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
    }

    .app-header {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 20px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .app-header h1 {
      font-size: 2rem;
      margin: 0 0 4px 0;
    }

    .app-header p {
      font-size: 0.95rem;
      margin: 0;
      opacity: 0.9;
    }

    .app-main {
      flex: 1;
      padding: 20px 0;
    }

    .config-section {
      margin-bottom: 20px;
    }

    .three-column-layout {
      display: grid;
      grid-template-columns: 280px 1fr 380px;
      gap: 20px;
      min-height: calc(100vh - 280px);
    }

    .column {
      display: flex;
      flex-direction: column;
    }

    .app-footer {
      background: #1e293b;
      color: #94a3b8;
      padding: 16px 0;
      text-align: center;
      margin-top: 20px;
    }

    .app-footer p {
      margin: 0;
      font-size: 0.85rem;
    }

    .app-footer a {
      color: #60a5fa;
      text-decoration: none;
    }

    .app-footer a:hover {
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 1400px) {
      .three-column-layout {
        grid-template-columns: 250px 1fr 350px;
      }
    }

    @media (max-width: 1200px) {
      .three-column-layout {
        grid-template-columns: 1fr;
        gap: 20px;
        min-height: auto;
      }

      .column {
        min-height: 400px;
      }
    }

    @media (max-width: 768px) {
      .app-header h1 {
        font-size: 1.5rem;
      }

      .app-header p {
        font-size: 0.85rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'Prompt Engineer';
  activePillarId = 'task-context';

  onPillarSelected(pillarId: string): void {
    this.activePillarId = pillarId;
  }
}
