import { DragScrollDirective } from './drag-scroll.directive';
import { AppComponent } from './../app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DragScrollDirective', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, DragScrollDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(AppComponent);
  });

  describe('onMouseDown', () => {
    it('should add grabbing', () => {
      const terrain: DebugElement = fixture.debugElement
        .query(By.css('#terrain-wrapper'));

      terrain.triggerEventHandler('mousedown', null);

      expect(terrain.classes.grabbing).toBe(true);
    });
  });

  describe('onMouseUp', () => {
    it('should remove grabbing', () => {
      const terrain: DebugElement = fixture.debugElement
        .query(By.css('#terrain-wrapper'));

      terrain.triggerEventHandler('mouseup', null);

      expect(terrain.classes.grabbing).toBeUndefined();
    });
  });

  // TODO: Add tests for coordinates stuff
});

