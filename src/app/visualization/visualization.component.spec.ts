import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from '../app.component';
import { VisualizationComponent } from './visualization.component';
import { By } from '@angular/platform-browser';

describe('VisualizationComponent', () => {
  describe('toggleGrid', () => {
    it('should toggle the grid', () => {
      TestBed.configureTestingModule({
        declarations: [AppComponent, VisualizationComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });
      const fixture = TestBed.createComponent(AppComponent);
      const app: AppComponent = fixture.componentInstance;
      const comp: VisualizationComponent = fixture.debugElement
        .query(By.directive(VisualizationComponent)).componentInstance;

      app['_obstacles'][2] = true;
      app['_tiles'] = [0, 1, 2];
      fixture.detectChanges();
      comp.toggleGrid();
      const grid: HTMLElement = fixture.nativeElement.querySelector('#terrain-wrapper');

      expect(grid.classList).toContain('hide-grid');
      comp.toggleGrid();
      expect(grid.classList).not.toContain('hide-grid');
    });
  });

  describe('findRover', () => {
    it('should emit through findRoverEmitter', () => {
      const comp = new VisualizationComponent();
      spyOn(comp.findRoverEmitter, 'emit');

      comp.findRover();

      expect(comp.findRoverEmitter.emit).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    setTimeout(() => {
      // Override fixed element to avoid test log covering
      const welcome = document.querySelector('#welcome-wrapper') as HTMLElement;
      if (welcome) {
        welcome.remove();
      }
    }, 1000);
  });
});
