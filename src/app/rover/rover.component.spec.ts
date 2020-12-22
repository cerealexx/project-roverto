import { RoverComponent } from './rover.component';
import { fakeAsync, flush, tick } from '@angular/core/testing';
import { HelperService } from '../services/helper.service';
import { skip } from 'rxjs/operators';

describe('RoverComponent', () => {
  let helper: HelperService;

  beforeEach(async () => {
    helper = new HelperService();
  });

  describe('move', () => {
    it('should call finishMovement with direction', () => {
      const comp = new RoverComponent(helper);
      spyOn<any>(comp, '_finishMovement');

      comp.move(['f']);

      expect(comp['_finishMovement']).toHaveBeenCalledWith('f');
    });

    it('should set executingPath to false', done => {
      const comp = new RoverComponent(helper);

      helper.executingPath.next(true);
      comp.move(['f']);

      helper.executingPath.pipe(skip(1)).subscribe(executingPath => {
        expect(executingPath).toBe(false);
        done();
      });
    });
  });

  describe('finishMovement', () => {
    it('should substract 42 from Y if there is no obstacle facing north', fakeAsync(() => {
      const comp = new RoverComponent(helper);
      spyOn<any>(comp, '_isFacingObstacle').and.returnValue(false);

      comp['_x'] = 42;
      comp['_y'] = 42;
      comp['_facing'] = 'n';
      comp['_finishMovement']('f');
      tick(500);

      expect(comp.y).toBe(0);
      flush();
    }));

    it('should add 42 to X if there is no obstacle facing east', fakeAsync(() => {
      const comp = new RoverComponent(helper);
      spyOn<any>(comp, '_isFacingObstacle').and.returnValue(false);

      comp['_x'] = 42;
      comp['_y'] = 42;
      comp['_facing'] = 'e';
      comp['_finishMovement']('f');
      tick(500);

      expect(comp.x).toBe(84);
      flush();
    }));

    it('should add 42 to Y if there is no obstacle facing south', fakeAsync(() => {
      const comp = new RoverComponent(helper);
      spyOn<any>(comp, '_isFacingObstacle').and.returnValue(false);

      comp['_x'] = 42;
      comp['_y'] = 42;
      comp['_facing'] = 's';
      comp['_finishMovement']('f');
      tick(500);

      expect(comp.y).toBe(84);
      flush();
    }));

    it('should substract 42 from X if there is no obstacle facing west', fakeAsync(() => {
      const comp = new RoverComponent(helper);
      spyOn<any>(comp, '_isFacingObstacle').and.returnValue(false);

      comp['_x'] = 42;
      comp['_y'] = 42;
      comp['_facing'] = 'w';
      comp['_finishMovement']('f');
      tick(500);

      expect(comp.x).toBe(0);
      flush();
    }));

    it('should face east when turning right from north', fakeAsync(() => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'n';
      comp['_finishMovement']('r');
      tick(500);

      expect(comp['_facing']).toBe('e');
      expect(comp.rotation).toBe(90);
      flush();
    }));

    it('should face south when turning right from east', fakeAsync(() => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'e';
      comp['_finishMovement']('r');
      tick(500);

      expect(comp['_facing']).toBe('s');
      expect(comp.rotation).toBe(90);
      flush();
    }));

    it('should face west when turning right from south', fakeAsync(() => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 's';
      comp['_finishMovement']('r');
      tick(500);

      expect(comp['_facing']).toBe('w');
      expect(comp.rotation).toBe(90);
      flush();
    }));

    it('should face north when turning right from west', fakeAsync(() => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'w';
      comp['_finishMovement']('r');
      tick(500);

      expect(comp['_facing']).toBe('n');
      expect(comp.rotation).toBe(90);
      flush();
    }));

    it('should face east when turning left from south', fakeAsync(() => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 's';
      comp['_finishMovement']('l');
      tick(500);

      expect(comp['_facing']).toBe('e');
      expect(comp.rotation).toBe(-90);
      flush();
    }));

    it('should face north when turning left from east', fakeAsync(() => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'e';
      comp['_finishMovement']('l');
      tick(500);

      expect(comp['_facing']).toBe('n');
      expect(comp.rotation).toBe(-90);
      flush();
    }));

    it('should face west when turning left from north', fakeAsync(() => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'n';
      comp['_finishMovement']('l');
      tick(500);

      expect(comp['_facing']).toBe('w');
      expect(comp.rotation).toBe(-90);
      flush();
    }));

    it('should face south when turning left from west', fakeAsync(() => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'w';
      comp['_finishMovement']('l');
      tick(500);

      expect(comp['_facing']).toBe('s');
      expect(comp.rotation).toBe(-90);
      flush();
    }));

    it('should stop if obstacle is found', async () => {
      const comp = new RoverComponent(helper);
      spyOn<any>(comp, '_isFacingObstacle').and.returnValue(true);

      comp['_y'] = 0;
      await comp['_finishMovement']('n');

      expect(comp.y).toBe(0);
    });
  });

  describe('isFacingObstacle', () => {
    it('should return true if out of bounds from north', () => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'n';
      comp['_y'] = 0;

      expect(comp['_isFacingObstacle']('n')).toBe(true);
    });

    it('should return true if out of bounds from south', () => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 's';
      comp['_y'] = 8317;

      expect(comp['_isFacingObstacle']('s')).toBe(true);
    });

    it('should return true if out of bounds from east', () => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'e';
      comp['_x'] = 8317;

      expect(comp['_isFacingObstacle']('e')).toBe(true);
    });

    it('should return true if out of bounds from west', () => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'w';
      comp['_x'] = 0;

      expect(comp['_isFacingObstacle']('w')).toBe(true);
    });

    it('should return true if finds obstacle going east', () => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'e';
      comp['_y'] = 0;
      comp['_x'] = 0;
      comp.obstacles[1] = true;

      expect(comp['_isFacingObstacle']('e')).toBe(true);
    });

    it('should return true if finds obstacle going south', () => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 's';
      comp['_y'] = 0;
      comp['_x'] = 0;
      comp.obstacles[200] = true;

      expect(comp['_isFacingObstacle']('s')).toBe(true);
    });

    it('should return true if finds obstacle going north', () => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'n';
      comp['_y'] = 1;
      comp['_x'] = 0;
      comp.obstacles[0] = true;

      expect(comp['_isFacingObstacle']('n')).toBe(true);
    });

    it('should return true if finds obstacle going west', () => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'w';
      comp['_y'] = 0;
      comp['_x'] = 1;
      comp.obstacles[0] = true;

      expect(comp['_isFacingObstacle']('w')).toBe(true);
    });

    it('should return false if movement can be executed', () => {
      const comp = new RoverComponent(helper);

      comp['_facing'] = 'e';
      comp['_y'] = 0;
      comp['_x'] = 0;
      comp.obstacles = [false, false, true];

      expect(comp['_isFacingObstacle']('e')).toBe(false);
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
