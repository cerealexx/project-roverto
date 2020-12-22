import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { AppComponent } from './app.component';
import { RoverComponent } from './rover/rover.component';
import { FormsModule } from '@angular/forms';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { WelcomeModalComponent } from './welcome-modal/welcome-modal.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DragScrollDirective } from './directives/drag-scroll.directive';
import { VisualizationComponent } from './visualization/visualization.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    RoverComponent,
    ControlPanelComponent,
    WelcomeModalComponent,
    DragScrollDirective,
    VisualizationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    MatSliderModule,
    MatSlideToggleModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
