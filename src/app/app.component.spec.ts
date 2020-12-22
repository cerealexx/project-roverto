import { fakeAsync, flush, tick } from '@angular/core/testing';
import { RoverComponent } from './rover/rover.component';
import { InitialData } from './models/interfaces';
import { HelperService } from './services/helper.service';
import { AppComponent } from './app.component';
import { ElementRef } from '@angular/core';
import { skip } from 'rxjs/operators';
declare const viewport: any;

describe('AppComponent', () => {
  let helper: HelperService;
  // Override capital styling
  document.body.style.textTransform = 'inherit';

  beforeEach(async () => {
    helper = new HelperService();
  });

  it('should detect if the device has phone size', () => {
    const app = new AppComponent(helper);

    viewport.set(320, 800);
    app.ngOnInit();

    expect(app.isPhone).toBe(true);
  });

  it('should detect if the device has regular size', () => {
    const app = new AppComponent(helper);

    viewport.set(1024, 768);
    app.ngOnInit();

    expect(app.isPhone).toBe(false);
  });

  describe('setMission', () => {
    it('should call initTerrain', () => {
      const app = new AppComponent(helper);
      spyOn<any>(app, '_coordinatesToTile').and.returnValue(1);
      const initTerrain = spyOn<any>(app, '_initTerrain');

      const initialData: InitialData = {
        x: 0,
        y: 0,
        obstacleDensity: 1
      };
      app.setMission(initialData);

      expect(initTerrain).toHaveBeenCalled();
    });

    it('should set initialData', () => {
      const app = new AppComponent(helper);
      spyOn<any>(app, '_coordinatesToTile').and.returnValue(1);

      const initialData: InitialData = {
        x: 0,
        y: 0,
        obstacleDensity: 1
      };
      app.setMission(initialData);

      expect(app['_initialData']).toBe(initialData);
    });

    it('should call populateObstacles', () => {
      const app = new AppComponent(helper);
      spyOn<any>(app, '_coordinatesToTile').and.returnValue(1);
      const populateObstacles = spyOn<any>(app, '_populateObstacles');

      const initialData: InitialData = {
        x: 0,
        y: 0,
        obstacleDensity: 1
      };
      app.setMission(initialData);

      expect(populateObstacles).toHaveBeenCalled();
    });

    it('should call setRoverPxInitialPosition', () => {
      const app = new AppComponent(helper);
      spyOn<any>(app, '_coordinatesToTile').and.returnValue(1);
      const setRoverPxInitialPosition = spyOn<any>(app, '_setRoverPxInitialPosition');

      const initialData: InitialData = {
        x: 0,
        y: 0,
        obstacleDensity: 1
      };
      app.setMission(initialData);

      expect(setRoverPxInitialPosition).toHaveBeenCalled();
    });

    it('should call centerViewInRover', () => {
      const app = new AppComponent(helper);
      spyOn<any>(app, '_coordinatesToTile').and.returnValue(1);
      const centerViewInRover = spyOn<any>(app, 'centerViewInRover');

      const initialData: InitialData = {
        x: 0,
        y: 0,
        obstacleDensity: 1
      };

      app.setMission(initialData);

      expect(centerViewInRover).toHaveBeenCalled();
    });

    it ('should set loadingMission to false', done => {
      const app = new AppComponent(helper);
      const initialData: InitialData = {
        x: 0,
        y: 0,
        obstacleDensity: 1
      };
      spyOn<any>(app, '_coordinatesToTile').and.returnValue(1);

      helper.loadingMission.next(true);
      app.setMission(initialData);

      helper.loadingMission.pipe(skip(1)).subscribe(loadingMission => {
        expect(loadingMission).toBe(false);
        done();
      });
    });

    it('should set hideWelcome to false', () => {
      const app = new AppComponent(helper);
      spyOn<any>(app, '_coordinatesToTile').and.returnValue(1);
      const initialData: InitialData = {
        x: 0,
        y: 0,
        obstacleDensity: 1
      };

      app.setMission(initialData);

      expect(app.hideWelcome).toBe(false);
    });
  });

  describe('centerViewInRover', () => {
    it('should scroll to correct offsetHeight', () => {
      const app = new AppComponent(helper);

      app.terrain = new ElementRef({});
      app.terrain.nativeElement.offsetHeight = 10;
      app['_initialData'].y = 1;
      jasmine.clock().install();
      app.centerViewInRover();
      jasmine.clock().tick(300);

      expect(app.terrain.nativeElement.scrollTop).toBe(37);
      jasmine.clock().uninstall();
    });

    it('should scroll to correct offsetWidth', () => {
      const app = new AppComponent(helper);

      app.terrain = new ElementRef({});
      app.terrain.nativeElement.offsetWidth = 10;
      app['_initialData'].x = 1;
      jasmine.clock().install();
      app.centerViewInRover();
      jasmine.clock().tick(300);

      expect(app.terrain.nativeElement.scrollLeft).toBe(37);
      jasmine.clock().uninstall();
    });
  });

  describe('reset', () => {
    it('should set hideWelcome to false', () => {
      const app = new AppComponent(helper);

      app.reset();

      expect(app.hideWelcome).toBe(false);
    });
  });

  describe('initTerrain', () => {
    it('should fill the tiles array', () => {
      const app = new AppComponent(helper);

      app['_initTerrain']();

      expect(app.tiles.length).toBe(40000);
    });
  });

  describe('populateObstacles', () => {
    it('should fill the obstacles array', () => {
      const app = new AppComponent(helper);
      spyOn<any>(app, '_coordinatesToTile').and.returnValue(1);

      app['_initialData'].obstacleDensity = 3000;
      app['_populateObstacles']();

      expect(app.obstacles.length).toBeGreaterThan(1000);
    });

    it('should not render an obstacle under initial rover tile', () => {
      const app = new AppComponent(helper);
      spyOn<any>(app, '_coordinatesToTile').and.returnValue(0);
      spyOn<any>(Math, 'random').and.returnValue(0);

      app['_initialData'].x = 0;
      app['_initialData'].y = 0;
      app['_populateObstacles']();

      expect(app.obstacles.length).toBe(0);
    });
  });

  describe('setRoverPxInitialPosition', () => {
    it('should transform y to pixels', fakeAsync(() => {
      const app = new AppComponent(helper);
      const rover = new RoverComponent(helper);

      app.rover = rover;
      app['_initialData'].y = 1;
      app['_setRoverPxInitialPosition']();
      tick(1);

      expect(app.rover.initialPosition.y).toBe(42);
      flush();
    }));

    it('should transform x to pixels', fakeAsync(() => {
      const app = new AppComponent(helper);
      const rover = new RoverComponent(helper);

      app.rover = rover;
      app['_initialData'].x = 2;
      app['_setRoverPxInitialPosition']();
      tick(1);

      expect(app.rover.initialPosition.x).toBe(84);
      flush();
    }));
  });

  describe('coordinatesToTile', () => {
    it('should call coordinatesToTile from helperService', () => {
      const app = new AppComponent(helper);
      spyOn<any>(helper, 'coordinatesToTile');

      const mockArgs = {x: 20, y: 50};
      app['_coordinatesToTile'](mockArgs);

      expect(helper.coordinatesToTile).toHaveBeenCalledWith(mockArgs);
    });
  });

  afterEach(() => {
    viewport.reset();
    setTimeout(() => {
      // Override fixed element to avoid test log covering
      const welcome = document.querySelector('#welcome-wrapper') as HTMLElement;
      if (welcome) {
        welcome.remove();
      }
    }, 1000);
  });
});
