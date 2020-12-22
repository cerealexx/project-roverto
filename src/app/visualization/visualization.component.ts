import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent {
  @Input() terrain: HTMLDivElement | undefined;
  @Input() isPhone = false;
  @Output() findRoverEmitter: EventEmitter<null> = new EventEmitter();

  public toggleGrid(): void {
    this.terrain?.classList.toggle('hide-grid');
  }

  public findRover(): void {
    this.findRoverEmitter.emit();
  }
}
