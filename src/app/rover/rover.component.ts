import { HelperService } from './../services/helper.service';
import { Component, Input, OnInit } from '@angular/core';
import { Coordinates } from '../models/interfaces';

@Component({
  selector: 'app-rover',
  templateUrl: './rover.component.html',
  styleUrls: ['./rover.component.scss']
})
export class RoverComponent implements OnInit {
  private _x = 0;
  private _y = 0;
  private _facing: 'n' | 'e' | 's' | 'w' = 'e';
  private _rotation = 0;
  private _idle = true;
  public initialPosition: Coordinates = {x: 0, y: 0};
  @Input() obstacles: boolean[] = [];

  constructor(private _helperService: HelperService) {}

  ngOnInit(): void {}

  // GETTERS // ----------------------------------------

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get rotation(): number {
    return this._rotation;
  }

  public get idle(): boolean {
    return this._idle;
  }

  // SETTERS // ----------------------------------------

  public set facing(direction: 'n' | 'e' | 's' | 'w') {
    this._facing = direction;
  }

  // PUBLIC METHODS // ----------------------------------

  public async move(directions: string[]): Promise<void> {
    // Toggles idle glow animation and tries to execute each movement
    this._idle = false;

    for (const direction of directions) {
      try {
        await this._finishMovement(direction);
      } catch (e) {
        console.log(e);
        break;
      }
    }

    this._helperService.executingPath.next(false);
    this._idle = true;
  }

  // PRIVATE METHODS // ----------------------------------

  private _finishMovement(direction: string): Promise<void> {
    // Returns a resolved or rejected promise depending if the rover finds an obstacle if moved forward
    // Rotates the rover if the direction is equal to 'r' or 'l'
    return new Promise((resolve, reject) => {
      // The timeout waits for the animation to finish
      setTimeout(() => {
        switch (direction) {
          case 'f':
            switch (this._facing) {
              case 'n':
                this._isFacingObstacle('n') ? reject('Found obstacle facing north!') : this._y -= 42;
                break;
              case 'e':
                this._isFacingObstacle('e') ? reject('Found obstacle facing east!') : this._x += 42;
                break;
              case 's':
                this._isFacingObstacle('s') ? reject('Found obstacle facing south!') : this._y += 42;
                break;
              case 'w':
                this._isFacingObstacle('w') ? reject('Found obstacle facing west!') : this._x -= 42;
                break;
            }
            break;
          case 'r':
            this._rotation += 90;
            switch (this._facing) {
              case 'n':
                this._facing = 'e';
                break;
              case 'e':
                this._facing = 's';
                break;
              case 's':
                this._facing = 'w';
                break;
              case 'w':
                this._facing = 'n';
                break;
            }
            break;
          case 'l':
            this._rotation -= 90;
            switch (this._facing) {
              case 'n':
                this._facing = 'w';
                break;
              case 'e':
                this._facing = 'n';
                break;
              case 's':
                this._facing = 'e';
                break;
              case 'w':
                this._facing = 's';
                break;
            }
            break;
        }
        resolve();
      }, 500);
    });
  }

  private _isFacingObstacle(direction: 'n' | 'e' | 's' | 'w'): boolean {
    // Looks for adjacent obstacle tiles and returns a boolean,
    // triggering highlight animation if the result is true
    const currentRoverPosition = {
      x: this.initialPosition.x + this._x,
      y: this.initialPosition.y + this._y
    };
    const roverTile = this._helperService.coordinatesToTile({
      x: currentRoverPosition.x / 42,
      y: currentRoverPosition.y / 42
    });
    const _checkForObstacle = (tileToCheck: number): boolean => {
      // Check for off bounds
      if (
        (currentRoverPosition.x < 42 && this._facing === 'w') ||
        (currentRoverPosition.x > 8316 && this._facing === 'e') ||
        (currentRoverPosition.y > 8316  && this._facing === 's') ||
        (currentRoverPosition.y < 42 && this._facing === 'n')
      ) {
        return true;
      }
      // Check for regular obstacle
      if (this.obstacles[tileToCheck]) {
        this._helperService.highlightObstacle(tileToCheck);
      }
      return this.obstacles[tileToCheck];
    };

    switch (direction) {
      case 'n':
        return _checkForObstacle(roverTile - 200);
      case 'e':
        return _checkForObstacle(roverTile + 1);
      case 's':
        return _checkForObstacle(roverTile + 200);
      case 'w':
        return _checkForObstacle(roverTile - 1);
    }
  }

}
