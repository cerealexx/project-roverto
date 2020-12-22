import { HelperService } from './services/helper.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RoverComponent } from './rover/rover.component';
import { Coordinates, InitialData } from './models/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private _tiles: number[] = [];
  private _obstacles: boolean[] = [];
  private _hideWelcome = false;
  private _initialData: InitialData = {
    x: 0,
    y: 0,
    obstacleDensity: 1
  };
  private _isPhone = false;
  @ViewChild ('rover', {static: true}) rover?: RoverComponent;
  @ViewChild ('terrain', {static: true}) terrain?: ElementRef;

  constructor(private _helperService: HelperService) {}

  ngOnInit(): void {
    this._isPhone = window.innerWidth < 678 ? true : false;
  }

  // GETTERS // ----------------------------------------

  public get hideWelcome(): boolean {
    return this._hideWelcome;
  }

  public get obstacles(): boolean[] {
    return this._obstacles;
  }

  public get tiles(): number[] {
    return this._tiles;
  }

  public get isPhone(): boolean {
    return this._isPhone;
  }

  // PUBLIC METHODS // ----------------------------------------

  public setMission(initialData: InitialData): void {
    this._initTerrain();
    this._initialData = initialData;
    this._populateObstacles();
    this._setRoverPxInitialPosition();
    this.centerViewInRover();

    // Hack to avoid render position blink
    setTimeout(() => {
      this._helperService.loadingMission.next(false);
      this._hideWelcome = true;
    }, 100);
  }

  // PUBLIC METHODS // ----------------------------------------

  public centerViewInRover(): void {
    // Scroll terrain to rover initial position
    setTimeout(() => {
      if (this.terrain) {
        const terrainElement = this.terrain.nativeElement;
        terrainElement.scrollTop = (this._initialData.y * 42) - (terrainElement.offsetHeight / 2);
        terrainElement.scrollLeft = (this._initialData.x * 42) - (terrainElement.offsetWidth / 2);
      }
    }, 200);
  }

  public reset(): void {
    this._hideWelcome = false;
  }

  // PRIVATE METHODS // ----------------------------------------

  private _initTerrain(): void {
    // Terrain grid init
    for (let i = 0; i < 40000; i++) {
      this._tiles.push(i);
    }
  }

  private _populateObstacles(): void {
    this._obstacles = [];
    // Populate obstacles
    for (let i = 0; i < this._initialData.obstacleDensity; i++) {
      const obstacleTile = Math.floor(Math.random() * 40000);
      // Prevent obstacle to appear under initial rover position
      if (this._coordinatesToTile({x: this._initialData.x, y: this._initialData.y}) !== obstacleTile) {
        this._obstacles[obstacleTile] = true;
      }
    }
  }

  private _setRoverPxInitialPosition(): void {
    // Set initial px position for rover
    // setTimeout with null waiting prevents Angular view checking cycle error
    setTimeout(() => {
      if (this.rover) {
        this.rover.initialPosition = {
          x: this._initialData.x * 42,
          y: this._initialData.y * 42
        };
      }
    });
  }

  private _coordinatesToTile(coordinates: Coordinates): number {
    // Returns a tile id number from element coordinates in terrain
    return this._helperService.coordinatesToTile(coordinates);
  }
}
