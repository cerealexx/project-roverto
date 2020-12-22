import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from '../app.component';
import { HelperService } from './helper.service';

describe('HelperService', () => {
  describe('coordinatesToTile', () => {
    it('should return the correct tile value', () => {
      const ser = new HelperService();

      expect(ser.coordinatesToTile({x: 1, y: 2})).toBe(401);
    });
  });

  describe('highlightObstacle', () => {

    it('should toggle highlight obstacle animation', fakeAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });

      const fixture = TestBed.createComponent(AppComponent);
      const ser = new HelperService();
      const app = fixture.componentInstance;

      app['_obstacles'][2] = true;
      app['_tiles'] = [0, 1, 2];
      fixture.detectChanges();
      ser.highlightObstacle(2);
      const tile: HTMLElement = fixture.nativeElement.querySelector('#tile2');

      expect(tile.classList).toContain('highlight-obstacle');
      tick(3000);
      expect(tile.classList).not.toContain('highlight-obstacle');
      flush();
    }));
  });
});
