import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Coordinates } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  public executingPath = new BehaviorSubject<boolean>(false);
  public loadingMission = new BehaviorSubject<boolean>(false);

  constructor() { }

  public coordinatesToTile(coordinates: Coordinates): number {
    // Returns a tile id number from element coordinates in terrain
    return (coordinates.y * 200) + coordinates.x;
  }

  public highlightObstacle(tile: number): void {
    // Toggles a highlight animation class in found obstacle
    const tileClassList = document.querySelector(`#tile${tile}`)?.classList;
    tileClassList?.add('highlight-obstacle');
    setTimeout(() => {
      tileClassList?.remove('highlight-obstacle');
    }, 3000);
  }
}
