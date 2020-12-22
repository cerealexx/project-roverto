import { RoverComponent } from './../rover/rover.component';
import { HelperService } from '../services/helper.service';
import { ControlPanelComponent } from './control-panel.component';

describe('ControlPanelComponent', () => {
  let helper: HelperService;

  beforeEach(async () => {
    helper = new HelperService();
  });

  describe('onInit', () => {
    it('should subscribe to executingPath', () => {
      const comp = new ControlPanelComponent(helper);

      comp.ngOnInit();

      expect(comp['_executingPathSub']).not.toBeUndefined();
    });
  });

  describe('sendDirections', () => {
    it('should call move from rover with directions', () => {
      const comp = new ControlPanelComponent(helper);

      comp.rover = new RoverComponent(helper);
      spyOn(comp.rover, 'move');
      comp.directions = 'flrfff';
      comp.sendDirections();

      expect(comp.rover.move).toHaveBeenCalledWith(['f', 'l', 'r', 'f', 'f', 'f']);
    });

    it('should reset directions', () => {
      const comp = new ControlPanelComponent(helper);
      comp.rover = new RoverComponent(helper);

      comp.directions = 'flrfff';
      comp.sendDirections();

      expect(comp.directions).toBe('');
    });
  });

  describe('checkKey', () => {
    it('should remove prohibited characters', () => {
      const comp = new ControlPanelComponent(helper);

      comp.directions = 'farla';
      comp.checkKey('');

      expect(comp.directions).toBe('frl');
    });

    it('should call sendDirections if key is Enter', () => {
      const comp = new ControlPanelComponent(helper);
      spyOn(comp, 'sendDirections');

      comp.checkKey('Enter');

      expect(comp.sendDirections).toHaveBeenCalled();
    });
  });

  describe('addCommand', () => {
    it('should push the direction to directions array', () => {
      const comp = new ControlPanelComponent(helper);

      comp.directions = 'lr';
      comp.addCommand('f');

      expect(comp.directions).toBe('lrf');
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
