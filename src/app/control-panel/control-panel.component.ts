import { HelperService } from './../services/helper.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RoverComponent } from '../rover/rover.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit, OnDestroy {
  public directions = '';
  @Input() rover?: RoverComponent;
  private _executingPath = false;
  private _executingPathSub: Subscription | undefined;

  constructor(private helperService: HelperService) { }

  ngOnInit(): void {
    this._executingPathSub = this.helperService.executingPath.subscribe(executingPath => this._executingPath = executingPath);
  }

  ngOnDestroy(): void {
    if (this._executingPathSub) {
      this._executingPathSub.unsubscribe();
    }
  }

  // GETTERS // ----------------------------------------

  public get executingPath(): boolean {
    return this._executingPath;
  }

  // PUBLIC METHODS // ----------------------------------------

  public sendDirections(): void {
    // Sends directions to rover and resets input
    if (!this._executingPath) {
      // Sets executing path state across components
      this.helperService.executingPath.next(true);
      // Orders rover to move
      this.rover?.move(this.directions.split(''));
      // Resets input state
      this.directions = '';
    }
  }

  public checkKey(key: string): void {
    // Removes every character that is not 'f', 'l' or 'r' from input
    this.directions = this.directions.replace(/[^flr]/g, '').toLowerCase();
    // If key is enter, sends directions
    if (key === 'Enter') {
      this.sendDirections();
    }
  }

  public addCommand(direction: 'f' | 'l' | 'r'): void {
    // Adds single command to directions
    this.directions += direction;
  }
}
