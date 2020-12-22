import { fakeAsync, flush, tick } from '@angular/core/testing';
import { HelperService } from './../services/helper.service';
import { WelcomeModalComponent } from './welcome-modal.component';

describe('WelcomeModalComponent', () => {
  let helper: HelperService;

  beforeEach(() => {
    helper = new HelperService();
  });

  describe('checkNumber', () => {
    it('should set coordinate to max of 199 when over 199', () => {
      const comp = new WelcomeModalComponent(helper);

      comp['_initialData'] = {
        x: 250,
        y: 371,
        obstacleDensity: 1
      };
      comp.checkNumber();

      expect(comp.initialData.x).toBe(199);
      comp.checkNumber();
      expect(comp.initialData.y).toBe(199);
    });

    it('should set coordinate to min of 0 when under 0', () => {
      const comp = new WelcomeModalComponent(helper);

      comp['_initialData'] = {
        x: -250,
        y: -371,
        obstacleDensity: 1
      };
      comp.checkNumber();

      expect(comp.initialData.x).toBe(0);
      comp.checkNumber();
      expect(comp.initialData.y).toBe(0);
    });
  });

  describe('startMission', () => {
    it('should set loadingMission to true', done => {
      const comp = new WelcomeModalComponent(helper);

      helper.loadingMission.next(false);
      comp.startMission();

      helper.loadingMission.subscribe(loadingMission => {
        expect(loadingMission).toBe(true);
        done();
      });
    });

    it('should emit initialData through initialDataEmitter', fakeAsync(() => {
        const comp = new WelcomeModalComponent(helper);
        spyOn(comp.initialDataEmitter, 'emit');

        comp['_initialData'] = {
          x: 0,
          y: 0,
          obstacleDensity: 1
        };
        comp.startMission();
        tick(100);

        expect(comp.initialDataEmitter.emit).toHaveBeenCalledWith(comp['_initialData']);
        flush();
    }));

    it('should reset obstacleDensity to 1', fakeAsync(() => {
      const comp = new WelcomeModalComponent(helper);

      comp['_initialData'].obstacleDensity = 500;
      comp.startMission();
      tick(100);

      expect(comp.initialData.obstacleDensity).toBe(1);
      flush();
    }));
  });
});
